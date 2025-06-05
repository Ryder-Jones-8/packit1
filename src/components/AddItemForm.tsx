"use client";

import { useState } from 'react';
import { ClothingCategory, Season } from '@/lib/types/clothing';
import { addClothingItem } from '@/lib/services/clothingService';

export function AddItemForm({ onItemAdded }: { onItemAdded: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('shirts');
  const [color, setColor] = useState('');
  const [seasons, setSeasons] = useState<Season[]>(['all']);
  const [weatherConditions, setWeatherConditions] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const categories: ClothingCategory[] = [
    'shirts', 'pants', 'shorts', 'hoodies', 'jackets', 
    'shoes', 'accessories', 'underwear', 'socks'
  ];

  const allSeasons: Season[] = ['winter', 'spring', 'summer', 'fall', 'all'];
  
  const allWeatherConditions = ['rainy', 'cold', 'hot', 'snow', 'mild', 'windy'];
  const handleSeasonToggle = (season: Season) => {
    // If clicking on "all", select only "all" and deselect others
    if (season === 'all') {
      setSeasons(['all']);
      return;
    }
    
    // If "all" is currently selected and clicking on another season,
    // remove "all" and select only the clicked season
    if (seasons.includes('all')) {
      setSeasons([season]);
      return;
    }
    
    // Normal toggle behavior for other seasons
    if (seasons.includes(season)) {
      // If removing the last season, revert to "all"
      if (seasons.length === 1) {
        setSeasons(['all']);
      } else {
        setSeasons(seasons.filter(s => s !== season));
      }
    } else {
      setSeasons([...seasons, season]);
    }
  };

  const handleWeatherToggle = (condition: string) => {
    if (weatherConditions.includes(condition)) {
      setWeatherConditions(weatherConditions.filter(c => c !== condition));
    } else {
      setWeatherConditions([...weatherConditions, condition]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !category || !color) {
      alert('Please fill out all required fields');
      return;
    }
    
    const newItem = {
      name,
      category,
      seasons,
      weatherConditions,
      color,
      description: description || undefined,
    };
    
    addClothingItem(newItem);
    
    // Reset form
    setName('');
    setCategory('shirts');
    setColor('');
    setSeasons(['all']);
    setWeatherConditions([]);
    setDescription('');
    
    // Notify parent component
    onItemAdded();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-medium mb-4">Add New Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="e.g., Black T-Shirt"
            required
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ClothingCategory)}            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color *
          </label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="e.g., Black, Blue, Red"
            required
          />
        </div>
        
        {/* Seasons */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Seasons</span>
          <div className="flex flex-wrap gap-2">
            {allSeasons.map(season => (
              <button
                key={season}
                type="button"
                className={`px-3 py-1 text-sm rounded-full ${
                  seasons.includes(season) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                } border`}
                onClick={() => handleSeasonToggle(season)}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Weather Conditions */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</span>
          <div className="flex flex-wrap gap-2">
            {allWeatherConditions.map(condition => (
              <button
                key={condition}
                type="button"
                className={`px-3 py-1 text-sm rounded-full ${
                  weatherConditions.includes(condition) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                } border`}
                onClick={() => handleWeatherToggle(condition)}
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            rows={3}
            placeholder="Any additional details about this item"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
