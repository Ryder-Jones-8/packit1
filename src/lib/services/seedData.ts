import { ClothingItem } from '../types/clothing';
import { getAllClothingItems } from './clothingService';
import { generateId } from '../utils/helpers';

// Sample clothing data
const sampleClothingItems: Omit<ClothingItem, 'id' | 'addedAt'>[] = [
  // Shirts
  {
    name: 'Blue T-Shirt',
    category: 'shirts',
    seasons: ['spring', 'summer', 'fall'],
    weatherConditions: ['sunny', 'warm', 'hot'],
    color: 'blue',
    description: 'Comfortable cotton t-shirt'
  },
  {
    name: 'White Button-Down',
    category: 'shirts',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    weatherConditions: ['mild', 'warm', 'indoor'],
    color: 'white',
    description: 'Formal button-down shirt'
  },
  {
    name: 'Striped Polo',
    category: 'shirts',
    seasons: ['spring', 'summer'],
    weatherConditions: ['mild', 'warm', 'hot', 'sunny'],
    color: 'multi',
    description: 'Navy and white striped polo'
  },

  // Pants
  {
    name: 'Khaki Chinos',
    category: 'pants',
    seasons: ['spring', 'fall', 'winter'],
    weatherConditions: ['mild', 'cool', 'cold'],
    color: 'beige',
    description: 'Classic khaki pants'
  },
  {
    name: 'Blue Jeans',
    category: 'pants',
    seasons: ['all'],
    weatherConditions: ['cool', 'mild', 'cold'],
    color: 'blue',
    description: 'Versatile denim jeans'
  },
  {
    name: 'Black Dress Pants',
    category: 'pants',
    seasons: ['all'],
    weatherConditions: ['mild', 'cool', 'indoor'],
    color: 'black',
    description: 'Formal dress pants'
  },

  // Shorts
  {
    name: 'Khaki Shorts',
    category: 'shorts',
    seasons: ['summer'],
    weatherConditions: ['hot', 'sunny', 'warm'],
    color: 'beige',
    description: 'Summer khaki shorts'
  },
  {
    name: 'Athletic Shorts',
    category: 'shorts',
    seasons: ['spring', 'summer'],
    weatherConditions: ['warm', 'hot', 'humid'],
    color: 'gray',
    description: 'Breathable exercise shorts'
  },

  // Hoodies
  {
    name: 'Gray Hoodie',
    category: 'hoodies',
    seasons: ['fall', 'winter'],
    weatherConditions: ['cool', 'cold', 'windy'],
    color: 'gray',
    description: 'Warm pullover hoodie'
  },
  {
    name: 'Black Zip-Up Hoodie',
    category: 'hoodies',
    seasons: ['spring', 'fall'],
    weatherConditions: ['cool', 'mild', 'windy'],
    color: 'black',
    description: 'Lightweight zip-up hoodie'
  },

  // Jackets
  {
    name: 'Rain Jacket',
    category: 'jackets',
    seasons: ['spring', 'fall'],
    weatherConditions: ['rainy', 'wet', 'windy'],
    color: 'yellow',
    description: 'Waterproof rain jacket'
  },
  {
    name: 'Winter Parka',
    category: 'jackets',
    seasons: ['winter'],
    weatherConditions: ['cold', 'snow', 'freezing'],
    color: 'black',
    description: 'Heavy insulated winter coat'
  },
  {
    name: 'Light Windbreaker',
    category: 'jackets',
    seasons: ['spring', 'fall'],
    weatherConditions: ['mild', 'windy', 'cool'],
    color: 'blue',
    description: 'Lightweight windbreaker jacket'
  },

  // Shoes
  {
    name: 'Walking Shoes',
    category: 'shoes',
    seasons: ['all'],
    weatherConditions: ['mild', 'dry', 'sunny'],
    color: 'gray',
    description: 'Comfortable walking shoes'
  },
  {
    name: 'Waterproof Boots',
    category: 'shoes',
    seasons: ['fall', 'winter'],
    weatherConditions: ['rainy', 'snow', 'wet', 'cold'],
    color: 'brown',
    description: 'Insulated waterproof boots'
  },
  {
    name: 'Sandals',
    category: 'shoes',
    seasons: ['summer'],
    weatherConditions: ['hot', 'sunny', 'beach'],
    color: 'brown',
    description: 'Casual summer sandals'
  },

  // Accessories
  {
    name: 'Winter Hat',
    category: 'accessories',
    seasons: ['winter'],
    weatherConditions: ['cold', 'snow', 'freezing'],
    color: 'black',
    description: 'Warm knit beanie'
  },
  {
    name: 'Sunglasses',
    category: 'accessories',
    seasons: ['spring', 'summer'],
    weatherConditions: ['sunny', 'bright'],
    color: 'black',
    description: 'UV protective sunglasses'
  },
  {
    name: 'Umbrella',
    category: 'accessories',
    seasons: ['all'],
    weatherConditions: ['rainy', 'wet'],
    color: 'black',
    description: 'Compact travel umbrella'
  },

  // Underwear
  {
    name: 'Boxers',
    category: 'underwear',
    seasons: ['all'],
    weatherConditions: ['all'],
    color: 'various',
    description: 'Everyday boxers'
  },
  {
    name: 'Briefs',
    category: 'underwear',
    seasons: ['all'],
    weatherConditions: ['all'],
    color: 'various',
    description: 'Everyday briefs'
  },

  // Socks
  {
    name: 'Crew Socks',
    category: 'socks',
    seasons: ['all'],
    weatherConditions: ['all'],
    color: 'black',
    description: 'Everyday crew socks'
  },
  {
    name: 'Wool Socks',
    category: 'socks',
    seasons: ['fall', 'winter'],
    weatherConditions: ['cold', 'snow', 'freezing'],
    color: 'gray',
    description: 'Warm wool socks'
  },
  {
    name: 'No-Show Socks',
    category: 'socks',
    seasons: ['spring', 'summer'],
    weatherConditions: ['warm', 'hot'],
    color: 'white',
    description: 'Low-cut no-show socks'
  }
];

/**
 * Initialize the app with sample clothing data if none exists
 */
export function initializeAppData() {
  const existingClothes = getAllClothingItems();
  
  // Only seed data if there are no existing items
  if (existingClothes.length === 0) {
    console.log('Initializing app with sample clothing data...');
    
    // Add sample items to local storage
    const sampleItemsWithIds: ClothingItem[] = sampleClothingItems.map(item => ({
      ...item,
      id: generateId(),
      addedAt: new Date()
    }));
    
    localStorage.setItem('packit-clothing-items', JSON.stringify(sampleItemsWithIds));
    console.log(`Added ${sampleItemsWithIds.length} sample clothing items`);
  }
}
