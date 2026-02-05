import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useFoodData } from '../../hooks/useFoodData';
import { shareCSV } from '../../utils/csvExport';

export default function DatabaseScreen() {
    const [activeTab, setActiveTab] = React.useState<'meals' | 'ingredients'>('meals');
    const context = useFoodData();
    const dataManager = activeTab === 'meals' ? context.meals : context.ingredients;
    const { items, toggleStatus } = dataManager;

    const handleExport = () => {
        shareCSV(context.meals.items, context.ingredients.items);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => toggleStatus(item.id)} style={styles.item}>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
            />
            <View style={styles.details}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText style={{ color: item.status === 'liked' ? 'green' : item.status === 'disliked' ? 'red' : 'gray' }}>
                    {item.status ? item.status.toUpperCase() : 'UNSEEN'}
                </ThemedText>
            </View>
            <Ionicons
                name={item.status === 'liked' ? 'heart' : item.status === 'disliked' ? 'thumbs-down' : 'help-circle-outline'}
                size={24}
                color={item.status === 'liked' ? 'green' : item.status === 'disliked' ? 'red' : 'gray'}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Database</ThemedText>
                <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
                    <Ionicons name="share-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.segmentContainer}>
                <TouchableOpacity
                    style={[styles.segmentButton, activeTab === 'meals' && styles.activeSegment]}
                    onPress={() => setActiveTab('meals')}
                >
                    <ThemedText style={[styles.segmentText, activeTab === 'meals' && styles.activeSegmentText]}>Meals</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.segmentButton, activeTab === 'ingredients' && styles.activeSegment]}
                    onPress={() => setActiveTab('ingredients')}
                >
                    <ThemedText style={[styles.segmentText, activeTab === 'ingredients' && styles.activeSegmentText]}>Ingredients</ThemedText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exportButton: {
        padding: 8,
    },
    segmentContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeSegment: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    segmentText: {
        fontWeight: '600',
        color: '#6b7280',
    },
    activeSegmentText: {
        color: '#000',
    },
    list: {
        padding: 20,
        paddingTop: 0,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
});
