import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { FoodItem } from '../types';
import { ThemedText } from './ThemedText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeCardProps {
    food: FoodItem;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export function SwipeCard({ food, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);

    const pan = Gesture.Pan()
        .onUpdate((event) => {
            translationX.value = event.translationX;
            translationY.value = event.translationY;
        })
        .onEnd((event) => {
            if (translationX.value > SWIPE_THRESHOLD) {
                // Swipe Right
                translationX.value = withTiming(SCREEN_WIDTH * 1.5, {}, () => {
                    runOnJS(onSwipeRight)();
                });
            } else if (translationX.value < -SWIPE_THRESHOLD) {
                // Swipe Left
                translationX.value = withTiming(-SCREEN_WIDTH * 1.5, {}, () => {
                    runOnJS(onSwipeLeft)();
                });
            } else {
                // Reset
                translationX.value = withSpring(0);
                translationY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translationX.value },
            { translateY: translationY.value },
            { rotate: `${interpolate(translationX.value, [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2], [-15, 15])}deg` },
        ],
    }));

    const likeOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translationX.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
    }));

    const nopeOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translationX.value, [-SCREEN_WIDTH / 4, 0], [1, 0], Extrapolation.CLAMP),
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.card, animatedStyle]}>
                <Image
                    source={food.image}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
                <View style={styles.overlayContainer}>
                    <View style={styles.overlay}>
                        <ThemedText type="title" style={styles.text}>{food.name}</ThemedText>
                    </View>

                    {/* Like Overlay */}
                    <Animated.View style={[styles.feedback, styles.like, likeOpacityStyle]}>
                        <ThemedText type="title" style={styles.feedbackText}>LIKE</ThemedText>
                    </Animated.View>

                    {/* Nope Overlay */}
                    <Animated.View style={[styles.feedback, styles.nope, nopeOpacityStyle]}>
                        <ThemedText type="title" style={styles.feedbackText}>NOPE</ThemedText>
                    </Animated.View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 1.3,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        overflow: 'hidden',
        position: 'absolute',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    text: {
        color: 'white',
    },
    feedback: {
        position: 'absolute',
        top: 40,
        padding: 10,
        borderWidth: 4,
        borderRadius: 10,
        transform: [{ rotate: '0deg' }]
    },
    like: {
        left: 40,
        borderColor: '#4ade80',
        transform: [{ rotate: '-15deg' }]
    },
    nope: {
        right: 40,
        borderColor: '#f87171',
        transform: [{ rotate: '15deg' }]
    },
    feedbackText: {
        color: 'white',
        fontWeight: '900',
        textTransform: 'uppercase'
    }
});
