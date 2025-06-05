import { ClothingItem, ClothingCategory, Season } from '../types/clothing';
import { generateId } from '../utils/helpers';

// Local storage keys
const CLOTHING_ITEMS_KEY = 'packit-clothing-items';

/**
 * Get all clothing items from storage
 */
export function getAllClothingItems(): ClothingItem[] {
  if (typeof window === 'undefined') return [];
  
  const itemsJson = localStorage.getItem(CLOTHING_ITEMS_KEY);
  if (!itemsJson) return [];
  
  try {
    const items = JSON.parse(itemsJson);
    // Convert string dates back to Date objects
    return items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt)
    }));
  } catch (error) {
    console.error('Error parsing clothing items from storage:', error);
    return [];
  }
}

/**
 * Add a new clothing item
 */
export function addClothingItem(item: Omit<ClothingItem, 'id' | 'addedAt'>): ClothingItem {
  const newItem: ClothingItem = {
    ...item,
    id: generateId(),
    addedAt: new Date()
  };
  
  const items = getAllClothingItems();
  items.push(newItem);
  
  saveClothingItems(items);
  return newItem;
}

/**
 * Update an existing clothing item
 */
export function updateClothingItem(id: string, updates: Partial<ClothingItem>): ClothingItem | null {
  const items = getAllClothingItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = { ...items[index], ...updates };
  items[index] = updatedItem;
  
  saveClothingItems(items);
  return updatedItem;
}

/**
 * Delete a clothing item
 */
export function deleteClothingItem(id: string): boolean {
  const items = getAllClothingItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }
  
  items.splice(index, 1);
  saveClothingItems(items);
  return true;
}

/**
 * Get clothing items by category
 */
export function getClothingItemsByCategory(category: ClothingCategory): ClothingItem[] {
  const items = getAllClothingItems();
  return items.filter(item => item.category === category);
}

/**
 * Save clothing items to storage
 * @private
 */
function saveClothingItems(items: ClothingItem[]): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CLOTHING_ITEMS_KEY, JSON.stringify(items));
}

/**
 * Search clothing items by name or description
 */
export function searchClothingItems(query: string): ClothingItem[] {
  if (!query) return getAllClothingItems();
  
  const items = getAllClothingItems();
  const lowerQuery = query.toLowerCase();
  
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    (item.description && item.description.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filter clothing items by season
 */
export function filterBySeason(season: Season): ClothingItem[] {
  const items = getAllClothingItems();
  return items.filter(item => item.seasons.includes(season) || item.seasons.includes('all'));
}

/**
 * Get all available clothing categories
 */
export function getAllCategories(): ClothingCategory[] {
  return [
    'shirts',
    'pants',
    'shorts',
    'hoodies',
    'jackets',
    'shoes',
    'accessories',
    'underwear',
    'socks'
  ];
}
