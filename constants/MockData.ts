import { FoodItem } from '../types';

const FOOD_NAMES = [
    'Pizza Margherita', 'Sushi Platter', 'Burger Royale', 'Pasta Carbonara',
    'Caesar Salad', 'Tacos al Pastor', 'Pad Thai', 'Steak Frites',
    'Dim Sum', 'Lobster Roll', 'Ramen', 'Pho', 'Burrito Bowl',
    'Chicken Tikka Masala', 'Falafel Wrap', 'Donuts', 'Ice Cream Sundae',
    'Cheesecake', 'Croissant', 'Bagel & Lox'
];

export const generateMockFoods = (): FoodItem[] => {
    return FOOD_NAMES.map((name, index) => ({
        id: `food-${index}`,
        name,
        image: `https://picsum.photos/seed/${name.replace(/ /g, '')}/600/800`, // Deterministic random images
        status: null,
    }));
};
