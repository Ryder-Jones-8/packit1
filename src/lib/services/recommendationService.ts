import { ClothingItem, Season } from '../types/clothing';
import { WeatherForecast } from '../types/trip';
import { getSeason } from '../utils/helpers';

type RecommendationRules = {
  [key: string]: {
    minTemp?: number;
    maxTemp?: number;
    conditions?: string[];
    categories: string[];
    count: number;
  };
};

// Rules for recommending clothing based on weather
const recommendationRules: RecommendationRules = {
  hotWeather: {
    minTemp: 80,
    categories: ['shirts', 'shorts', 'shoes', 'accessories'],
    count: 2,
  },
  warmWeather: {
    minTemp: 70,
    maxTemp: 80,
    categories: ['shirts', 'shorts', 'pants', 'shoes', 'accessories'],
    count: 1,
  },
  mildWeather: {
    minTemp: 60,
    maxTemp: 70,
    categories: ['shirts', 'pants', 'hoodies', 'shoes', 'accessories'],
    count: 1,
  },
  coolWeather: {
    minTemp: 50,
    maxTemp: 60,
    categories: ['shirts', 'pants', 'hoodies', 'jackets', 'shoes', 'accessories'],
    count: 1,
  },
  coldWeather: {
    maxTemp: 50,
    categories: ['shirts', 'pants', 'hoodies', 'jackets', 'shoes', 'accessories'],
    count: 2,
  },
  rainyConditions: {
    conditions: ['rain', 'rainy', 'thunderstorm', 'drizzle'],
    categories: ['jackets', 'pants', 'shoes'],
    count: 1,
  },
  snowyConditions: {
    conditions: ['snow', 'snowy', 'blizzard'],
    categories: ['jackets', 'pants', 'shoes'],
    count: 1,
  },
};

// Essentials that should always be packed
const essentialsByTripLength: Record<string, { categories: string[], count: number }[]> = {
  short: [ // 1-3 days
    { categories: ['underwear', 'socks'], count: 4 },  // 1 per day + 1 extra
    { categories: ['shirts'], count: 3 },
    { categories: ['pants', 'shorts'], count: 2 },
  ],
  medium: [ // 4-7 days
    { categories: ['underwear', 'socks'], count: 8 },  // 1 per day + 1 extra
    { categories: ['shirts'], count: 6 },
    { categories: ['pants', 'shorts'], count: 4 },
  ],
  long: [ // 8+ days
    { categories: ['underwear', 'socks'], count: 10 }, // For longer trips, plan for laundry
    { categories: ['shirts'], count: 8 },
    { categories: ['pants', 'shorts'], count: 5 },
  ],
};

/**
 * Recommend clothing items based on destination weather and trip length
 */
export function recommendItems(
  clothes: ClothingItem[], 
  weatherForecast: WeatherForecast[], 
  startDate: Date, 
  endDate: Date
): ClothingItem[] {
  const recommendations: ClothingItem[] = [];
  const tripLengthDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  // Determine trip length category
  let tripLengthCategory: 'short' | 'medium' | 'long';
  if (tripLengthDays <= 3) {
    tripLengthCategory = 'short';
  } else if (tripLengthDays <= 7) {
    tripLengthCategory = 'medium';
  } else {
    tripLengthCategory = 'long';
  }
  
  // Add essential items based on trip length
  const essentials = essentialsByTripLength[tripLengthCategory];
  essentials.forEach(essential => {
    const matchingClothes = clothes.filter(item => 
      essential.categories.includes(item.category)
    );
    
    // Add up to the specified count of each essential type
    for (let i = 0; i < Math.min(essential.count, matchingClothes.length); i++) {
      if (matchingClothes[i] && !recommendations.includes(matchingClothes[i])) {
        recommendations.push(matchingClothes[i]);
      }
    }
  });
  
  // Analyze weather forecast
  let minTemp = 100;
  let maxTemp = 0;
  const conditions: string[] = [];
  
  weatherForecast.forEach(day => {
    minTemp = Math.min(minTemp, day.minTemp);
    maxTemp = Math.max(maxTemp, day.maxTemp);
    if (!conditions.includes(day.condition.toLowerCase())) {
      conditions.push(day.condition.toLowerCase());
    }
  });
  
  // Apply weather-based rules
  Object.values(recommendationRules).forEach(rule => {
    let matchesWeather = true;
    
    // Check temperature range
    if (rule.minTemp !== undefined && minTemp < rule.minTemp) matchesWeather = false;
    if (rule.maxTemp !== undefined && maxTemp > rule.maxTemp) matchesWeather = false;
    
    // Check conditions
    if (rule.conditions && rule.conditions.length > 0) {
      matchesWeather = rule.conditions.some(cond => 
        conditions.some(forecast => forecast.toLowerCase().includes(cond.toLowerCase()))
      );
    }
    
    if (matchesWeather) {
      // Find matching clothes for each category in the rule
      rule.categories.forEach(category => {
        const matchingItems = clothes.filter(item => 
          item.category === category && 
          !recommendations.includes(item)
        );
        
        // Add up to the specified count for this rule
        for (let i = 0; i < Math.min(rule.count, matchingItems.length); i++) {
          if (matchingItems[i]) {
            recommendations.push(matchingItems[i]);
          }
        }
      });
    }
  });
  
  return recommendations;
}
