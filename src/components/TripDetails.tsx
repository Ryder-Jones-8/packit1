"use client";

import { useState, useEffect } from 'react';
import { Trip, Bag } from '@/lib/types/trip';
import { ClothingItem, Season } from '@/lib/types/clothing';
import { addItemToBag, removeItemFromBag, getPackingRecommendations, isItemPacked, refreshWeatherData } from '@/lib/services/tripService';
import { getAllClothingItems } from '@/lib/services/clothingService';
import { formatDate } from '@/lib/utils/helpers';

interface TripDetailsProps {
  trip: Trip;
  onTripUpdate: (updatedTrip: Trip) => void;
}

export default function TripDetails({ trip, onTripUpdate }: TripDetailsProps) {
  const [activeTab, setActiveTab] = useState<'bags' | 'recommendations'>('bags');
  const [selectedBag, setSelectedBag] = useState<string>(trip.bags[0]?.id);
  const [availableItems, setAvailableItems] = useState<ClothingItem[]>(() => {
    const allItems = getAllClothingItems();
    return allItems.filter(item => !isItemPacked(trip.id, item.id));
  });
  const [recommendations, setRecommendations] = useState<ClothingItem[]>(() => {
    return getPackingRecommendations(trip.id);
  });  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSeasons, setExpandedSeasons] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Refresh weather data when component mounts
  useEffect(() => {
    const updateWeatherData = async () => {
      try {
        setIsRefreshing(true);
        const updatedTrip = await refreshWeatherData(trip.id);
        if (updatedTrip) {
          onTripUpdate(updatedTrip);
        }
      } catch (error) {
        console.error('Failed to update weather data:', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    updateWeatherData();
  }, [trip.id]);
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Toggle season expansion
  const toggleSeason = (categorySeasonKey: string) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [categorySeasonKey]: !prev[categorySeasonKey]
    }));
  };
  // Group items by category
  const groupedItems = availableItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ClothingItem[]>);

  // Function to organize items by seasons within each category
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

  const handleAddToBag = (bagId: string, item: ClothingItem) => {
    try {
      const updatedTrip = addItemToBag(trip.id, bagId, item);
      if (updatedTrip) {
        onTripUpdate(updatedTrip);
        setAvailableItems(availableItems.filter(i => i.id !== item.id));
      }
    } catch (error) {
      console.error('Error adding item to bag:', error);
      alert(error instanceof Error ? error.message : 'Failed to add item to bag');
    }
  };

  const handleRemoveFromBag = (bagId: string, itemId: string) => {
    const updatedTrip = removeItemFromBag(trip.id, bagId, itemId);
    if (updatedTrip) {
      onTripUpdate(updatedTrip);
      const item = getAllClothingItems().find(i => i.id === itemId);
      if (item) {
        setAvailableItems([...availableItems, item]);
      }
    }
  };

  const currentBag = trip.bags.find(bag => bag.id === selectedBag);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Trip header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold mb-2">{trip.destination}</h2>
        <p className="text-white/90">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        {trip.notes && (
          <div className="mt-4 p-3 bg-blue-700/40 rounded">
            <h3 className="font-medium mb-1">Trip Notes:</h3>
            <p className="text-white/90">{trip.notes}</p>
          </div>
        )}
      </div>      {/* Weather section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900">Weather Forecast</h3>
          <button 
            onClick={async () => {
              try {
                setIsRefreshing(true);
                const updatedTrip = await refreshWeatherData(trip.id);
                if (updatedTrip) {
                  onTripUpdate(updatedTrip);
                }
              } finally {
                setIsRefreshing(false);
              }
            }}
            disabled={isRefreshing}
            className="text-sm flex items-center text-blue-600 hover:text-blue-800"
          >            {isRefreshing ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Forecast
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {trip.weatherForecast && trip.weatherForecast.length > 0 ? (
            trip.weatherForecast.map((forecast, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded flex items-center">
                <div className="mr-3 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {forecast.condition.toLowerCase().includes('rain') ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    ) : forecast.condition.toLowerCase().includes('cloud') ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(forecast.date).toLocaleDateString('en-US', {
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </p>
                  <p className="font-medium text-gray-900">{forecast.minTemp}° - {forecast.maxTemp}° | {forecast.condition}</p>
                  <p className="text-xs text-gray-500">Precipitation: {forecast.precipitation}%</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-gray-500 italic">No weather forecast available</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('bags')}
            className={`py-4 px-6 font-medium ${
              activeTab === 'bags'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bags
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-4 px-6 font-medium ${
              activeTab === 'recommendations'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Packing Recommendations
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="p-6">
        {activeTab === 'bags' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bags list */}
            <div className="col-span-1 border-r border-gray-200 pr-4">
              <h3 className="font-medium mb-4 text-gray-900">My Bags</h3>
              <div className="space-y-3">
                {trip.bags.map(bag => (
                  <div
                    key={bag.id}
                    onClick={() => setSelectedBag(bag.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedBag === bag.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">{bag.name}</h4>
                      <span className="text-xs py-1 px-2 bg-gray-200 rounded-full text-gray-800">
                        {bag.items.length}/{bag.capacity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {bag.size === 'backpack' ? 'Small' : bag.size === 'carry-on' ? 'Medium' : 'Large'} size
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected bag contents */}
            <div className="col-span-1 md:col-span-2">
              {currentBag && (
                <>
                  <h3 className="font-medium mb-4 text-gray-900">
                    {currentBag.name} Contents ({currentBag.items.length}/{currentBag.capacity})
                  </h3>

                  {currentBag.items.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <p className="text-gray-500 mb-2">This bag is empty</p>
                      <p className="text-sm text-gray-500">Add items from your clothing catalog below</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {currentBag.items.map(item => (                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium text-black">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromBag(currentBag.id, item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available items to add */}
                  <div className="mt-8">
                    <h4 className="font-medium mb-3 text-gray-900">Add Items from Catalog</h4>
                    {availableItems.length === 0 ? (
                      <p className="text-gray-500 italic">No more items available in your catalog</p>
                    ) : (
                      <div className="space-y-3">                        {Object.entries(groupedItems).map(([category, items]) => {
                          const isExpanded = expandedCategories[category] || false;
                          const itemsBySeasons = organizeItemsBySeasons(items);
                          
                          return (
                            <div key={category} className="rounded-md overflow-hidden shadow-sm border border-gray-200">
                              <div 
                                className="bg-gray-800 py-2 px-4 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleCategory(category)}
                              >
                                <h5 className="text-sm font-medium text-white capitalize">{category} ({items.length})</h5>
                                <button className="p-1 rounded-full hover:bg-gray-700">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-5 w-5 transition-transform text-white ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                              
                              {isExpanded && (
                                <div className="bg-white p-3 space-y-4">
                                  {Object.entries(itemsBySeasons).map(([season, seasonItems]) => {
                                    const seasonKey = `${category}-${season}`;
                                    const isSeasonExpanded = expandedSeasons[seasonKey] || false;
                                    
                                    return (
                                      <div key={seasonKey} className="border rounded-md overflow-hidden">
                                        <div 
                                          className="bg-gray-100 px-4 py-2 flex justify-between items-center cursor-pointer"
                                          onClick={() => toggleSeason(seasonKey)}
                                        >
                                          <h6 className="text-sm font-medium text-gray-800">
                                            {season.charAt(0).toUpperCase() + season.slice(1)} ({seasonItems.length})
                                          </h6>
                                          <button className="p-1 rounded-full hover:bg-gray-200">
                                            <svg 
                                              xmlns="http://www.w3.org/2000/svg" 
                                              className={`h-4 w-4 transition-transform text-gray-600 ${isSeasonExpanded ? 'rotate-180' : ''}`}
                                              fill="none" 
                                              viewBox="0 0 24 24" 
                                              stroke="currentColor"
                                            >
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                          </button>
                                        </div>
                                        
                                        {isSeasonExpanded && (
                                          <div className="bg-white p-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                              {seasonItems.map(item => (
                                                <div key={item.id} className="bg-gray-50 border border-gray-200 hover:border-blue-300 rounded p-2 flex justify-between items-center">
                                                  <span className="text-black">{item.name}</span>
                                                  <button
                                                    onClick={() => handleAddToBag(currentBag.id, item)}
                                                    disabled={currentBag.items.length >= currentBag.capacity}
                                                    className={`text-blue-600 hover:text-blue-800 p-1 ${
                                                      currentBag.items.length >= currentBag.capacity ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                    </svg>
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
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
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4 text-gray-900">Packing Recommendations</h3>
              <p className="text-gray-600 text-sm mb-4">
                Based on your destination, weather forecast, and trip duration, we recommend packing the following items:
              </p>

              {recommendations.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 mb-2">No recommendations available</p>
                  <p className="text-sm text-gray-500">This could be due to missing weather data or not enough items in your catalog.</p>
                </div>
              ) : (
                <div className="space-y-4">                  {Object.entries(recommendations.reduce((acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, ClothingItem[]>)).map(([category, items]) => {
                    const isExpanded = expandedCategories[`rec-${category}`] || false;
                    const itemsBySeasons = organizeItemsBySeasons(items);
                    
                    return (
                      <div key={category} className="rounded-md overflow-hidden shadow-sm border border-gray-200">
                        <div 
                          className="bg-gray-800 py-2 px-4 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleCategory(`rec-${category}`)}
                        >
                          <h4 className="text-md font-medium text-white capitalize">{category} ({items.length})</h4>
                          <button className="p-1 rounded-full hover:bg-gray-700">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 transition-transform text-white ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        
                        {isExpanded && (
                          <div className="bg-white p-4 space-y-4">
                            {Object.entries(itemsBySeasons).map(([season, seasonItems]) => {
                              const seasonKey = `rec-${category}-${season}`;
                              const isSeasonExpanded = expandedSeasons[seasonKey] || false;
                              
                              return (
                                <div key={seasonKey} className="border rounded-md overflow-hidden">
                                  <div 
                                    className="bg-gray-100 px-4 py-2 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSeason(seasonKey)}
                                  >
                                    <h6 className="text-sm font-medium text-gray-800">
                                      {season.charAt(0).toUpperCase() + season.slice(1)} ({seasonItems.length})
                                    </h6>
                                    <button className="p-1 rounded-full hover:bg-gray-200">
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-4 w-4 transition-transform text-gray-600 ${isSeasonExpanded ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                  
                                  {isSeasonExpanded && (
                                    <div className="bg-white p-4">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {seasonItems.map(item => {
                                          const isPacked = isItemPacked(trip.id, item.id);
                                          return (
                                            <div 
                                              key={item.id} 
                                              className={`p-3 rounded-lg border ${
                                                isPacked 
                                                  ? 'border-green-300 bg-green-50' 
                                                  : 'border-gray-200 bg-white'
                                              }`}
                                            >
                                              <div className="flex justify-between items-center">
                                                <p className="font-medium text-black">{item.name}</p>
                                                {isPacked && (
                                                  <span className="text-green-600 text-xs font-medium bg-green-100 py-1 px-2 rounded-full">
                                                    Packed
                                                  </span>
                                                )}
                                              </div>
                                              {!isPacked && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                  <label className="text-sm text-gray-600 block mb-1">Add to:</label>
                                                  <div className="flex flex-wrap gap-2">
                                                    {trip.bags.map(bag => {
                                                      const isFull = bag.items.length >= bag.capacity;
                                                      return (
                                                        <button
                                                          key={bag.id}
                                                          disabled={isFull}
                                                          onClick={() => handleAddToBag(bag.id, item)}
                                                          className={`text-xs py-1 px-2 rounded-full ${
                                                            isFull 
                                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                          }`}
                                                        >
                                                          {bag.name} {isFull ? '(Full)' : ''}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
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
          </div>
        )}
      </div>
    </div>
  );
}