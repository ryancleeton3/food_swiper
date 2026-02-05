import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { FoodItem } from '../types';

export const generateCSV = (meals: FoodItem[], ingredients: FoodItem[]): string => {
    const header = 'ID,Name,Type,Status,Image URL\n';

    const mealRows = meals.map(item => {
        const status = item.status ? item.status : 'unseen';
        // Escape commas in names if necessary
        const safeName = item.name.includes(',') ? `"${item.name}"` : item.name;
        return `${item.id},${safeName},Meal,${status},${item.image}`;
    }).join('\n');

    const ingredientRows = ingredients.map(item => {
        const status = item.status ? item.status : 'unseen';
        const safeName = item.name.includes(',') ? `"${item.name}"` : item.name;
        return `${item.id},${safeName},Ingredient,${status},${item.image}`;
    }).join('\n');

    return header + mealRows + (mealRows && ingredientRows ? '\n' : '') + ingredientRows;
};

export const shareCSV = async (meals: FoodItem[], ingredients: FoodItem[]) => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
        alert('Email sharing is not available on this device');
        return;
    }

    const csvData = generateCSV(meals, ingredients);
    const fileUri = FileSystem.documentDirectory + 'food_swiper_data.csv';

    try {
        await FileSystem.writeAsStringAsync(fileUri, csvData, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        await MailComposer.composeAsync({
            subject: 'My Food Swiper Data',
            body: 'Here is the CSV export of your food preferences.',
            attachments: [fileUri],
        });
    } catch (error) {
        console.error('Error sharing CSV:', error);
        alert('Failed to generate or share CSV');
    }
};
