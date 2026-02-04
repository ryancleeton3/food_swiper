import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import InitialFoodData from '../constants/InitialFoodData.json';
import { FoodItem, FoodStatus } from '../types';

const STORAGE_KEY = '@food_swiper_data_v1';

type FoodContextType = {
    foods: FoodItem[];
    loading: boolean;
    swipeFood: (id: string, status: 'liked' | 'disliked') => void;
    toggleStatus: (id: string) => void;
    resetData: () => void;
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: React.ReactNode }) {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                setFoods(JSON.parse(jsonValue));
            } else {
                // First run: seed data from bundled JSON
                const initialData = InitialFoodData as FoodItem[];
                setFoods(initialData);
                await saveData(initialData);
            }
        } catch (e) {
            console.error('Failed to load food data', e);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (data: FoodItem[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save food data', e);
        }
    };

    const swipeFood = useCallback(async (id: string, status: 'liked' | 'disliked') => {
        setFoods(prevFoods => {
            const newFoods = prevFoods.map(food =>
                food.id === id ? { ...food, status } : food
            );
            saveData(newFoods); // Fire and forget save
            return newFoods;
        });
    }, []);

    const toggleStatus = useCallback(async (id: string) => {
        setFoods(prevFoods => {
            const newFoods = prevFoods.map(food => {
                if (food.id !== id) return food;
                const newStatus: FoodStatus = food.status === 'liked' ? 'disliked' : 'liked';
                return { ...food, status: newStatus };
            });
            saveData(newFoods);
            return newFoods;
        });
    }, []);

    const resetData = useCallback(async () => {
        const initialData = InitialFoodData as FoodItem[];
        setFoods(initialData);
        await saveData(initialData);
    }, []);

    return (
        <FoodContext.Provider value={{
            foods,
            loading,
            swipeFood,
            toggleStatus,
            resetData
        }
        }>
            {children}
        </FoodContext.Provider>
    );
}

// Hook to consume the context
export const useFoodData = () => {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error('useFoodData must be used within a FoodProvider');
    }

    // Derived state
    const database = context.foods;
    const stack = context.foods.filter(f => f.status === null);

    return {
        ...context,
        database,
        stack
    };
};
