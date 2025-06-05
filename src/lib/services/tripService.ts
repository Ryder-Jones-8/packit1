import { Trip, Bag, BagSize, WeatherForecast } from '../types/trip';
import { ClothingItem } from '../types/clothing';
import { generateId } from '../utils/helpers';
import { getWeatherForecast } from './weatherService';
import { recommendItems } from './recommendationService';
import { getAllClothingItems } from './clothingService';

// Local storage keys
const TRIPS_KEY = 'packit-trips';

/**
 * Get all trips from storage
 */
export function getAllTrips(): Trip[] {
  if (typeof window === 'undefined') return [];
  
  const tripsJson = localStorage.getItem(TRIPS_KEY);
  if (!tripsJson) return [];
  
  try {
    const trips = JSON.parse(tripsJson);
    // Convert string dates back to Date objects
    return trips.map((trip: any) => ({
      ...trip,
      startDate: new Date(trip.startDate),
      endDate: new Date(trip.endDate),
      weatherForecast: trip.weatherForecast ? trip.weatherForecast.map((forecast: any) => ({
        ...forecast,
        date: new Date(forecast.date)
      })) : undefined
    }));
  } catch (error) {
    console.error('Error parsing trips from storage:', error);
    return [];
  }
}

/**
 * Get a trip by ID
 */
export function getTripById(id: string): Trip | null {
  const trips = getAllTrips();
  return trips.find(trip => trip.id === id) || null;
}

/**
 * Create a new trip
 */
export async function createTrip(
  destination: string, 
  startDate: Date, 
  endDate: Date,
  notes?: string
): Promise<Trip> {
  // Create default bags
  const bags: Bag[] = [
    {
      id: generateId(),
      size: 'backpack',
      name: 'Backpack',
      items: [],
      capacity: 10
    },
    {
      id: generateId(),
      size: 'carry-on',
      name: 'Carry On',
      items: [],
      capacity: 20
    },
    {
      id: generateId(),
      size: 'large-luggage',
      name: 'Large Luggage',
      items: [],
      capacity: 40
    }
  ];
  
  // Get weather forecast for the destination
  const weatherForecast = await getWeatherForecast(destination, startDate, endDate);
  
  const newTrip: Trip = {
    id: generateId(),
    destination,
    startDate,
    endDate,
    bags,
    weatherForecast,
    notes
  };
  
  const trips = getAllTrips();
  trips.push(newTrip);
  
  saveTrips(trips);
  return newTrip;
}

/**
 * Update an existing trip
 */
export function updateTrip(id: string, updates: Partial<Trip>): Trip | null {
  const trips = getAllTrips();
  const index = trips.findIndex(trip => trip.id === id);
  
  if (index === -1) return null;
  
  const updatedTrip = { ...trips[index], ...updates };
  trips[index] = updatedTrip;
  
  saveTrips(trips);
  return updatedTrip;
}

/**
 * Delete a trip
 */
export function deleteTrip(id: string): boolean {
  const trips = getAllTrips();
  const filteredTrips = trips.filter(trip => trip.id !== id);
  
  if (filteredTrips.length === trips.length) {
    return false; // Trip not found
  }
  
  saveTrips(filteredTrips);
  return true;
}

/**
 * Add a clothing item to a bag
 */
export function addItemToBag(tripId: string, bagId: string, item: ClothingItem): Trip | null {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex(trip => trip.id === tripId);
  
  if (tripIndex === -1) return null;
  
  const trip = trips[tripIndex];
  const bagIndex = trip.bags.findIndex(bag => bag.id === bagId);
  
  if (bagIndex === -1) return null;
  
  // Check if bag has enough capacity
  const bag = trip.bags[bagIndex];
  if (bag.items.length >= bag.capacity) {
    throw new Error(`The ${bag.name} is full. Remove some items or choose a different bag.`);
  }
  
  // Check if the item is already in the bag
  if (bag.items.some(i => i.id === item.id)) {
    throw new Error(`This item is already in the ${bag.name}.`);
  }
  
  // Add the item to the bag
  bag.items.push(item);
  trip.bags[bagIndex] = bag;
  trips[tripIndex] = trip;
  
  saveTrips(trips);
  return trip;
}

/**
 * Remove a clothing item from a bag
 */
export function removeItemFromBag(tripId: string, bagId: string, itemId: string): Trip | null {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex(trip => trip.id === tripId);
  
  if (tripIndex === -1) return null;
  
  const trip = trips[tripIndex];
  const bagIndex = trip.bags.findIndex(bag => bag.id === bagId);
  
  if (bagIndex === -1) return null;
  
  // Filter out the item
  const bag = trip.bags[bagIndex];
  bag.items = bag.items.filter(item => item.id !== itemId);
  trip.bags[bagIndex] = bag;
  trips[tripIndex] = trip;
  
  saveTrips(trips);
  return trip;
}

/**
 * Generate packing recommendations for a trip
 */
export function getPackingRecommendations(tripId: string): ClothingItem[] {
  const trip = getTripById(tripId);
  if (!trip) return [];
  
  const clothingItems = getAllClothingItems();
  if (!trip.weatherForecast || trip.weatherForecast.length === 0) {
    return []; // No forecast available for recommendations
  }
  
  return recommendItems(clothingItems, trip.weatherForecast, trip.startDate, trip.endDate);
}

/**
 * Check if an item is already packed in any bag
 */
export function isItemPacked(tripId: string, itemId: string): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;
  
  return trip.bags.some(bag => bag.items.some(item => item.id === itemId));
}

/**
 * Refresh weather data for a trip
 */
export async function refreshWeatherData(tripId: string): Promise<Trip | null> {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex(trip => trip.id === tripId);
  
  if (tripIndex === -1) return null;
  
  const trip = trips[tripIndex];
  
  try {
    // Only fetch fresh weather data if the trip is current or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    
    // If the trip is already in the past, no need to refresh weather data
    if (new Date(trip.endDate) < today) {
      console.log("Trip is in the past, keeping existing weather data");
      return trip;
    }
    
    // Get fresh weather forecast
    const weatherForecast = await getWeatherForecast(
      trip.destination, 
      trip.startDate, 
      trip.endDate
    );
    
    // Update trip with new forecast
    const updatedTrip = { ...trip, weatherForecast };
    trips[tripIndex] = updatedTrip;
    
    saveTrips(trips);
    return updatedTrip;
  } catch (error) {
    console.error('Error refreshing weather data:', error);
    return trip; // Return original trip if refresh fails
  }
}

/**
 * Save trips to storage
 */
function saveTrips(trips: Trip[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

/**
 * Clear all trips
 * (Useful for testing or resetting the application)
 */
export function clearAllTrips(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRIPS_KEY);
}
