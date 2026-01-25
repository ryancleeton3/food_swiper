import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Swipe',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="fast-food" color={color} />,
                }}
            />
            <Tabs.Screen
                name="database"
                options={{
                    title: 'Database',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="list" color={color} />,
                }}
            />
        </Tabs>
    );
}
