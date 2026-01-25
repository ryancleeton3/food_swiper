import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { useFoodData } from '../../hooks/useFoodData';

export default function DatabaseScreen() {
    const { database, toggleStatus } = useFoodData();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => toggleStatus(item.id)} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
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
            <ThemedText type="title" style={styles.header}>Food Database</ThemedText>
            <FlatList
                data={database}
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
    },
    list: {
        padding: 20,
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
