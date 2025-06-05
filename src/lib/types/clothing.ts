export type ClothingCategory = 
  | 'shirts' 
  | 'pants' 
  | 'shorts' 
  | 'hoodies' 
  | 'jackets' 
  | 'shoes' 
  | 'accessories'
  | 'underwear'
  | 'socks';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  seasons: Season[];
  weatherConditions: string[]; // e.g., 'rainy', 'cold', 'hot', 'snow'
  color: string;
  description?: string;
  imageUrl?: string;
  addedAt: Date;
}
