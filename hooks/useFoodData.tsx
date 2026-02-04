import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IngredientData from '../constants/IngredientData.json';
import MealData from '../constants/MealData.json';
import { FoodItem, FoodStatus } from '../types';

const MEALS_KEY = '@food_swiper_meals_v1';
const INGREDIENTS_KEY = '@food_swiper_ingredients_v1';

type DataContextType = {
    items: FoodItem[];
    loading: boolean;
    swipeItem: (id: string, status: 'liked' | 'disliked') => void;
    toggleStatus: (id: string) => void;
    resetData: () => void;
};

// We will have two contexts, or one context that exposes two managers
type CombinedContextType = {
    meals: DataContextType;
    ingredients: DataContextType;
};

const FoodContext = createContext<CombinedContextType | undefined>(undefined);

function useDataManager(storageKey: string, initialData: FoodItem[]) {
    const [items, setItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(storageKey);
            if (jsonValue != null) {
                setItems(JSON.parse(jsonValue));
            } else {
                setItems(initialData);
                await saveData(initialData);
            }
        } catch (e) {
            console.error(`Failed to load data for ${storageKey}`, e);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (data: FoodItem[]) => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save data for ${storageKey}`, e);
        }
    };

    const swipeItem = useCallback(async (id: string, status: 'liked' | 'disliked') => {
        setItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === id ? { ...item, status } : item
            );
            saveData(newItems);
            return newItems;
        });
    }, []);

    const toggleStatus = useCallback(async (id: string) => {
        setItems(prevItems => {
            const newItems = prevItems.map(item => {
                if (item.id !== id) return item;
                const newStatus: FoodStatus = item.status === 'liked' ? 'disliked' : 'liked';
                return { ...item, status: newStatus };
            });
            saveData(newItems);
            return newItems;
        });
    }, []);

    const resetData = useCallback(async () => {
        setItems(initialData);
        await saveData(initialData);
    }, []);

    return { items, loading, swipeItem, toggleStatus, resetData };
}

export function FoodProvider({ children }: { children: React.ReactNode }) {
    const mealsManager = useDataManager(MEALS_KEY, MealData as FoodItem[]);
    const ingredientsManager = useDataManager(INGREDIENTS_KEY, IngredientData as FoodItem[]);

    console.log('FoodProvider rendering. Meals loading:', mealsManager.loading, 'Ingredients loading:', ingredientsManager.loading);

    return (
        <FoodContext.Provider value={{
            meals: mealsManager,
            ingredients: ingredientsManager
        }}>
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
    return context;
};

// Helper to get derived state (stack vs database)
export const useDerivedData = (manager: DataContextType) => {
    const database = manager.items;
    const stack = manager.items.filter(f => f.status === null);
    return { ...manager, database, stack };
};
