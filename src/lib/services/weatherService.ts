import axios from 'axios';
import { WeatherForecast } from '../types/trip';

// Using environment variable for API key
// In client components, environment variables should always be prefixed with NEXT_PUBLIC_
const OPENWEATHER_API_KEY = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY 
  : '';

// Fallback mock data for when API is unavailable or during development
const weatherData: Record<string, WeatherForecast[]> = {
  'new york': [
    { date: new Date(), minTemp: 65, maxTemp: 78, condition: 'Partly Cloudy', precipitation: 20 },
    { date: new Date(Date.now() + 86400000), minTemp: 68, maxTemp: 82, condition: 'Sunny', precipitation: 0 },
    { date: new Date(Date.now() + 172800000), minTemp: 70, maxTemp: 85, condition: 'Sunny', precipitation: 0 },
  ],
  'london': [
    { date: new Date(), minTemp: 55, maxTemp: 65, condition: 'Rainy', precipitation: 80 },
    { date: new Date(Date.now() + 86400000), minTemp: 52, maxTemp: 62, condition: 'Cloudy', precipitation: 40 },
    { date: new Date(Date.now() + 172800000), minTemp: 50, maxTemp: 60, condition: 'Rainy', precipitation: 90 },
  ],
  'miami': [
    { date: new Date(), minTemp: 78, maxTemp: 88, condition: 'Sunny', precipitation: 10 },
    { date: new Date(Date.now() + 86400000), minTemp: 80, maxTemp: 90, condition: 'Partly Cloudy', precipitation: 20 },
    { date: new Date(Date.now() + 172800000), minTemp: 82, maxTemp: 92, condition: 'Sunny', precipitation: 0 },
  ],
  'denver': [
    { date: new Date(), minTemp: 45, maxTemp: 65, condition: 'Sunny', precipitation: 0 },
    { date: new Date(Date.now() + 86400000), minTemp: 40, maxTemp: 60, condition: 'Partly Cloudy', precipitation: 10 },
    { date: new Date(Date.now() + 172800000), minTemp: 35, maxTemp: 55, condition: 'Cloudy', precipitation: 30 },
  ],
};

export async function getWeatherForecast(destination: string, startDate: Date, endDate: Date): Promise<WeatherForecast[]> {
  try {
    // Calculate the number of days for the forecast
    const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    // OpenWeather API only provides 5-day forecasts on the free tier
    const forecastDays = Math.min(tripDuration, 5);
    
    const realWeatherData = await fetchRealWeatherData(destination, forecastDays);
    
    if (realWeatherData && Array.isArray(realWeatherData)) {
      return realWeatherData;
    } else {
      console.log("Using fallback weather data due to API response format");
      return getFallbackWeatherData(destination, startDate, endDate);
    }
  } catch (error) {
    console.error("Error getting weather forecast:", error);
    // Fallback to mock data when API call fails
    return getFallbackWeatherData(destination, startDate, endDate);
  }
}

// Helper function to use mock data as fallback
function getFallbackWeatherData(destination: string, startDate: Date, endDate: Date): WeatherForecast[] {
  // Normalize the destination name for matching
  const normalizedDestination = destination.toLowerCase().trim();
  
  // Find the closest matching destination
  const destinations = Object.keys(weatherData);
  const closestMatch = destinations.find(d => 
    normalizedDestination.includes(d) || d.includes(normalizedDestination)
  );
  
  if (closestMatch) {
    return weatherData[closestMatch];
  }
  
  // Default weather if no match is found
  return [
    { date: new Date(startDate), minTemp: 65, maxTemp: 75, condition: 'Partly Cloudy', precipitation: 20 },
    { date: new Date(startDate.getTime() + 86400000), minTemp: 65, maxTemp: 75, condition: 'Partly Cloudy', precipitation: 20 },
    { date: new Date(startDate.getTime() + 172800000), minTemp: 65, maxTemp: 75, condition: 'Partly Cloudy', precipitation: 20 },
  ];
}

/**
 * Fetches real weather data from OpenWeather API
 */
// Map OpenWeather conditions to more user-friendly descriptions
const weatherConditionMapping: Record<string, string> = {
  'Thunderstorm': 'Stormy',
  'Drizzle': 'Light Rain',
  'Rain': 'Rainy',
  'Snow': 'Snowy',
  'Mist': 'Misty',
  'Smoke': 'Smoky',
  'Haze': 'Hazy',
  'Dust': 'Dusty',
  'Fog': 'Foggy',
  'Sand': 'Sandy',
  'Ash': 'Ashy',
  'Squall': 'Windy',
  'Tornado': 'Severe',
  'Clear': 'Sunny',
  'Clouds': 'Cloudy'
};

export async function fetchRealWeatherData(location: string, days: number = 5): Promise<WeatherForecast[]> {
  try {
    // Check if API key is available and valid (basic validation)
    const hasValidKey = OPENWEATHER_API_KEY && 
                        OPENWEATHER_API_KEY.length >= 20 && 
                        !OPENWEATHER_API_KEY.startsWith('y');
    
    // Skip API call if no valid API key is provided
    if (!hasValidKey) {
      console.log("No valid API key provided. Using mock data.");
      return getFallbackWeatherData(location, new Date(), new Date(Date.now() + days * 86400000));
    }

    // First, get coordinates from the location name
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!geoResponse.data || !geoResponse.data[0]) {
      throw new Error(`Location not found: ${location}`);
    }

    const { lat, lon } = geoResponse.data[0];

    // Now get the forecast using the coordinates
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    );

    if (!forecastResponse.data || !forecastResponse.data.list) {
      throw new Error(`Forecast data not available for: ${location}`);
    }

    // Process the OpenWeather API response
    const forecastList = forecastResponse.data.list;
    
    // Group forecasts by day (OpenWeather provides data in 3-hour increments)
    const dailyForecasts: Record<string, any[]> = {};
    
    forecastList.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000);
      const dateString = date.toDateString();
      
      if (!dailyForecasts[dateString]) {
        dailyForecasts[dateString] = [];
      }
      
      dailyForecasts[dateString].push(forecast);
    });

    // Convert to our WeatherForecast format
    const weatherForecasts: WeatherForecast[] = Object.keys(dailyForecasts).map(dateString => {
      const forecasts = dailyForecasts[dateString];
      
      // Calculate min/max temps for the day
      const temps = forecasts.map(f => f.main.temp);
      const minTemp = Math.floor(Math.min(...temps));
      const maxTemp = Math.ceil(Math.max(...temps));
        // Get the most common weather condition for the day
      const conditions = forecasts.map(f => f.weather[0].main);
      const conditionCounts: Record<string, number> = {};
      let mostCommonCondition = conditions[0];
      let maxCount = 0;
      
      for (const condition of conditions) {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        if (conditionCounts[condition] > maxCount) {
          maxCount = conditionCounts[condition];
          mostCommonCondition = condition;
        }
      }
      
      // Map the OpenWeather condition to a more user-friendly description
      const mappedCondition = weatherConditionMapping[mostCommonCondition] || mostCommonCondition;
      
      // Calculate average precipitation probability (convert from 0-1 to 0-100%)
      const precipitation = Math.round(
        forecasts.reduce((sum, f) => sum + (f.pop || 0), 0) / forecasts.length * 100
      );
        return {
        date: new Date(dateString),
        minTemp,
        maxTemp,
        condition: mappedCondition,
        precipitation
      };
    });

    return weatherForecasts.slice(0, days);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
