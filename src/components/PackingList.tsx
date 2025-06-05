"use client";

import { useState, useEffect } from 'react';
import { ClothingItem } from '@/lib/types/clothing';
import { Trip, Bag } from '@/lib/types/trip';
import { getAllClothingItems } from '@/lib/services/clothingService';
import { addItemToBag, removeItemFromBag } from '@/lib/services/tripService';

interface PackingListProps {
  trip: Trip;
  onTripUpdate?: (updatedTrip: Trip) => void;
}

export function PackingList({ trip, onTripUpdate }: PackingListProps) {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedBag, setSelectedBag] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load clothing items
  useEffect(() => {
    const items = getAllClothingItems();
    setClothingItems(items);
    
    // Set default selected bag
    if (trip.bags.length > 0 && !selectedBag) {
      setSelectedBag(trip.bags[0].id);
    }
  }, [trip, selectedBag]);

  // Get the selected bag data
  const selectedBagData = selectedBag 
    ? trip.bags.find(bag => bag.id === selectedBag) 
    : trip.bags[0];

  // Filter clothing items
  const filteredItems = clothingItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(filter.toLowerCase()) || 
      item.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item.color.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Check if an item is already packed in the selected bag
  const isItemInSelectedBag = (itemId: string): boolean => {
    if (!selectedBagData) return false;
    return selectedBagData.items.some(item => item.id === itemId);
  };

  // Check if an item is already packed in any bag
  const isItemInAnyBag = (itemId: string): boolean => {
    return trip.bags.some(bag => bag.items.some(item => item.id === itemId));
  };

  // Add item to the selected bag
  const handleAddToBag = (item: ClothingItem) => {
    if (!selectedBag || !trip) return;
    
    try {
      const updatedTrip = addItemToBag(trip.id, selectedBag, item);
      if (updatedTrip && onTripUpdate) {
        onTripUpdate(updatedTrip);
      }
    } catch (error: any) {
      alert(error.message || "Error adding item to bag");
    }
  };

  // Remove item from a bag
  const handleRemoveFromBag = (bagId: string, itemId: string) => {
    if (!trip) return;
    
    const updatedTrip = removeItemFromBag(trip.id, bagId, itemId);
    if (updatedTrip && onTripUpdate) {
      onTripUpdate(updatedTrip);
    }
  };

  // Get a list of unique categories from the clothing items
  const categories = ['all', ...new Set(clothingItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Bags */}
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-medium mb-4">My Bags</h2>
            <div className="space-y-4">
              {trip.bags.map((bag) => (
                <div 
                  key={bag.id}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    selectedBag === bag.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedBag(bag.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{bag.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bag.items.length >= bag.capacity
                        ? 'bg-red-100 text-red-800'
                        : bag.items.length > bag.capacity * 0.8
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {bag.items.length} / {bag.capacity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {bag.size === 'backpack' 
                      ? 'Small - Personal Item' 
                      : bag.size === 'carry-on'
                      ? 'Medium - Carry On'
                      : 'Large - Checked Luggage'
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedBagData && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">
                {selectedBagData.name} Contents
              </h2>
              
              {selectedBagData.items.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  This bag is empty. Add items from your catalog.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {selectedBagData.items.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromBag(selectedBagData.id, item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Right column - Available items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Add Items to Your Bag</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-gray-600">
                  {clothingItems.length === 0
                    ? "You don't have any clothing items yet. Add some in your catalog!"
                    : "No items match your search or filter criteria."}
                </p>
                
                {clothingItems.length === 0 && (
                  <a 
                    href="/catalog" 
                    className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Go to Catalog
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const inSelectedBag = isItemInSelectedBag(item.id);
                  const inAnyBag = isItemInAnyBag(item.id);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`border rounded-md p-3 ${
                        inSelectedBag 
                          ? 'border-blue-600 bg-blue-50'
                          : inAnyBag
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <div 
                          className="h-6 w-6 rounded-full" 
                          style={{ backgroundColor: item.color }} 
                        />
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.seasons.map(season => (
                          <span key={season} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {season}
                          </span>
                        ))}
                        {item.weatherConditions.map(condition => (
                          <span key={condition} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                            {condition}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-3">
                        {inSelectedBag ? (
                          <button
                            onClick={() => handleRemoveFromBag(selectedBagData!.id, item.id)}
                            className="w-full py-1 px-3 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                          >
                            Remove from {selectedBagData!.name}
                          </button>
                        ) : inAnyBag ? (
                          <button 
                            disabled
                            className="w-full py-1 px-3 bg-gray-100 text-gray-600 rounded cursor-not-allowed"
                          >
                            Already Packed
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToBag(item)}
                            className="w-full py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Add to {selectedBagData!.name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
