import { ClothingItem } from './clothing';

export type BagSize = 'backpack' | 'carry-on' | 'large-luggage';

export interface Bag {
  id: string;
  size: BagSize;
  name: string;
  items: ClothingItem[];
  capacity: number; // Number of items it can hold
}

export interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  bags: Bag[];
  weatherForecast?: WeatherForecast[];
  notes?: string;
}

export interface WeatherForecast {
  date: Date;
  minTemp: number;
  maxTemp: number;
  condition: string;
  precipitation: number;
}
