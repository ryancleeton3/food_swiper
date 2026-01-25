export type FoodStatus = 'liked' | 'disliked' | null;

export interface FoodItem {
  id: string;
  name: string;
  image: string; // URL or local require
  status: FoodStatus;
}
