"use client";

import { useState, useEffect } from 'react';
import { ClothingItem, ClothingCategory, Season } from '@/lib/types/clothing';
import { getAllClothingItems, deleteClothingItem } from '@/lib/services/clothingService';
import { AddItemForm } from './AddItemForm';
import ClosetView from './ui/ClosetView';

const ClothingManager = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ClothingCategory | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSeasons, setExpandedSeasons] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'closet'>('list');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const loadedItems = getAllClothingItems();
    setItems(loadedItems);
    
    // Initialize expanded state for new categories
    const initialExpandedState: Record<string, boolean> = {};
    loadedItems.forEach(item => {
      initialExpandedState[item.category] = initialExpandedState[item.category] || false;
    });
    setExpandedCategories(prev => ({...prev, ...initialExpandedState}));
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteClothingItem(id);
      loadItems();
    }
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const toggleSeason = (categorySeasonKey: string) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [categorySeasonKey]: !prev[categorySeasonKey]
    }));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(filter.toLowerCase()) || 
      item.description?.toLowerCase().includes(filter.toLowerCase()) ||
      item.color.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories: ClothingCategory[] = [
    'shirts', 'pants', 'shorts', 'hoodies', 'jackets', 
    'shoes', 'accessories', 'underwear', 'socks'
  ];

  // Group items by category
  const categorizedItems: Record<string, ClothingItem[]> = {};
  filteredItems.forEach(item => {
    if (!categorizedItems[item.category]) {
      categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
  });
  
  // Group items by category and then season
  const organizeItemsBySeasons = (items: ClothingItem[]) => {
    const seasonMap: Record<string, ClothingItem[]> = {};
    const allSeasons: Season[] = ['winter', 'spring', 'summer', 'fall', 'all'];
    
    allSeasons.forEach(season => {
      const itemsInSeason = items.filter(item => item.seasons.includes(season));
      if (itemsInSeason.length > 0) {
        seasonMap[season] = itemsInSeason;
      }
    });
    
    return seasonMap;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">My Closet Items</h2>
        <div className="flex space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('closet')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'closet' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Closet View
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Hide Form' : 'Add New Item'}
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <AddItemForm onItemAdded={() => {
          loadItems();
          setShowAddForm(false);
        }} />
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ClothingCategory | 'all')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {Object.keys(categorizedItems).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v5m-3 0h6m-6-3v-6m0 0 4-4m-4 4 4 4m3-4v6m0 0-4 4m4-4-4-4" />
          </svg>
          <h3 className="text-lg font-medium mb-2 text-black">No Items Found</h3>
          <p className="text-gray-600">
            {items.length === 0
              ? "You don't have any clothing items yet. Add some to get started!"
              : "No items match your current filters."}
          </p>
        </div>
      )}
      
      {viewMode === 'closet' ? (
        <ClosetView items={filteredItems} />
      ) : (
        <div className="space-y-4">
          {Object.entries(categorizedItems).map(([category, categoryItems]) => {
            const isExpanded = expandedCategories[category] || false;
            const itemsBySeasons = organizeItemsBySeasons(categoryItems);
            
            return (
              <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
                <div 
                  className="bg-gray-800 px-6 py-4 border-b flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="text-lg font-medium text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryItems.length})
                  </h3>
                  <button className="p-1 rounded-full hover:bg-gray-700">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 transition-transform text-white ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {Object.entries(itemsBySeasons).map(([season, seasonItems]) => {
                      const seasonKey = `${category}-${season}`;
                      const isSeasonExpanded = expandedSeasons[seasonKey] || false;
                      
                      return (
                        <div key={seasonKey} className="border rounded-md overflow-hidden">
                          <div 
                            className="bg-gray-800 px-4 py-3 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSeason(seasonKey)}
                          >
                            <h4 className="font-medium text-white">
                              {season.charAt(0).toUpperCase() + season.slice(1)} ({seasonItems.length})
                            </h4>
                            <button className="p-1 rounded-full hover:bg-gray-700">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 transition-transform text-white ${isSeasonExpanded ? 'rotate-180' : ''}`}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          
                          {isSeasonExpanded && (
                            <ul className="divide-y divide-gray-100">
                              {seasonItems.map(item => (
                                <li key={item.id} className="p-4 hover:bg-gray-50">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium text-black">{item.name}</h5>
                                      <p className="text-sm text-gray-600 mt-1">{item.color}</p>
                                      {item.description && (
                                        <p className="text-sm mt-2 text-black">{item.description}</p>
                                      )}
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {item.seasons
                                          .filter(s => s !== season) // Don't show current season
                                          .map(s => (
                                            <span 
                                              key={`${item.id}-${s}`}
                                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                            >
                                              {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </span>
                                          ))
                                        }
                                        {item.weatherConditions.map(condition => (
                                          <span 
                                            key={`${item.id}-${condition}`}
                                            className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                                          >
                                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClothingManager;