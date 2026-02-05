import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeCard } from '../../components/SwipeCard';
import { ThemedText } from '../../components/ThemedText';
import { useDerivedData, useFoodData } from '../../hooks/useFoodData';

export default function IngredientSwipeScreen() {
    const { ingredients } = useFoodData();
    const { stack, swipeItem, loading } = useDerivedData(ingredients);

    const handleSwipeLeft = () => {
        if (stack.length > 0) {
            swipeItem(stack[0].id, 'disliked');
        }
    };

    const handleSwipeRight = () => {
        if (stack.length > 0) {
            swipeItem(stack[0].id, 'liked');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardContainer}>
                {stack.length > 0 ? (
                    stack.slice(0, 2).reverse().map((food, index) => (
                        <SwipeCard
                            key={food.id}
                            food={food}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <ThemedText type="title">No more ingredients!</ThemedText>
                        <ThemedText>You've swiped them all.</ThemedText>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2ff', // Slightly different bg for visual distinction
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
