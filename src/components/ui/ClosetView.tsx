"use client";

import { useState } from "react";
import { ClothingItem, Season } from "@/lib/types/clothing";
import ClosetDoor from "./ClosetDoor";
import { motion } from "framer-motion";

interface ClosetViewProps {
  items: ClothingItem[];
}

export const ClosetView = ({ items }: ClosetViewProps) => {
  // State to track which doors are open
  const [openDoors, setOpenDoors] = useState<Record<Season, boolean>>({
    spring: false,
    summer: false,
    fall: false,
    winter: false,
    all: false
  });

  // Group items by season
  const itemsBySeason: Record<Season, ClothingItem[]> = {
    spring: [],
    summer: [],
    fall: [],
    winter: [],
    all: []
  };

  // Populate items by season
  items.forEach(item => {
    item.seasons.forEach(season => {
      if (season !== 'all') {
        if (!itemsBySeason[season].some(i => i.id === item.id)) {
          itemsBySeason[season].push(item);
        }
      }
    });
    
    // Add items with 'all' season to the 'all' category
    if (item.seasons.includes('all')) {
      itemsBySeason.all.push(item);
    }
  });  // Toggle a specific door
  const toggleDoor = (season: Season, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      
      // Check if the click was on the close button or its children
      if (event.target instanceof Element) {
        const target = event.target as Element;
        if (target.closest('button') && target.closest('button').textContent?.includes('Close Door')) {
          return; // Don't toggle the door if the close button was clicked
        }
      }
    }
    
    setOpenDoors(prev => ({
      ...prev,
      [season]: !prev[season]
    }));
  };
  // Close door handler specifically for the close button
  const closeDoor = (season: Season, event: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      
      // Stop any further event propagation
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }
    
    setOpenDoors(prev => ({
      ...prev,
      [season]: false
    }));
  };

  // Seasons to display (only show seasons that have items)
  const seasons: Season[] = Object.entries(itemsBySeason)
    .filter(([_, seasonItems]) => seasonItems.length > 0)
    .map(([season]) => season as Season);
  // Get season color theme for the header
  const getSeasonColorClass = (season: Season): string => {
    switch(season) {
      case 'spring': return 'bg-green-500';
      case 'summer': return 'bg-blue-500';
      case 'fall': return 'bg-orange-500';
      case 'winter': return 'bg-blue-700';
      case 'all': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-center mb-4">My Seasonal Closet</h3>
        
        {/* Season selector buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {seasons.map(season => (
            <button
              key={`btn-${season}`}
              onClick={() => toggleDoor(season)}
              className={`px-4 py-2 rounded-full ${getSeasonColorClass(season)} text-white font-medium ${
                openDoors[season] ? 'ring-4 ring-offset-2 ring-opacity-50' : 'hover:opacity-90'
              } transition-all`}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)} ({itemsBySeason[season].length})
            </button>
          ))}
        </div>
        
        <p className="text-gray-600">Click on a closet door or button to open your seasonal collections</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seasons.map(season => (          <ClosetDoor 
            key={season} 
            season={season}
            isOpen={openDoors[season]}
            onToggle={(e) => toggleDoor(season, e)}
          >
            <div className="pt-4">
              {/* Small, subtle season indicator that only shows when door is open */}
              {openDoors[season] && (                <div className="mb-4 flex justify-between items-center">
                  <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-70 text-gray-800">
                    {season.charAt(0).toUpperCase() + season.slice(1)} Collection ({itemsBySeason[season].length} items)
                  </div>                  <button 
                    onClick={(e) => closeDoor(season, e)}
                    className="flex items-center px-4 py-2 rounded-md bg-amber-800 text-white hover:bg-amber-700 transition-all shadow-md z-40 relative hover:scale-105 active:scale-95 border-2 border-amber-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Close Door
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {itemsBySeason[season].map(item => (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <span 
                          className="inline-block px-2 py-1 text-xs rounded-full shadow-sm"
                          style={{ 
                            backgroundColor: item.color,
                            color: isLightColor(item.color) ? '#000' : '#fff'
                          }}
                        >
                          {item.color}                        </span>
                        
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full text-black">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </div>
                      
                      <h5 className="font-medium mt-3 mb-1 text-black">{item.name}</h5>
                      
                      {item.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {/* Show season badges */}
                          {item.seasons
                            .filter(s => s !== season && s !== 'all')
                            .map(s => (
                              <span 
                                key={`${item.id}-season-${s}`}
                                className={`inline-block px-1.5 py-0.5 text-xs text-white rounded-md ${getSeasonColorClass(s as Season)}`}
                              >
                                {s}
                              </span>
                            ))
                          }
                          
                          {/* Weather conditions */}
                          {item.weatherConditions.map(condition => (
                            <span 
                              key={`${item.id}-${condition}`}
                              className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ClosetDoor>
        ))}
      </div>
    </div>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Convert named colors to hex
  const namedColors: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#FF0000",
    green: "#008000",
    blue: "#0000FF",
    yellow: "#FFFF00",
    orange: "#FFA500",
    purple: "#800080",
    pink: "#FFC0CB",
    gray: "#808080",
    brown: "#A52A2A",
    // Add more as needed
  };
  
  // If it's a named color, use the hex value
  const hexColor = namedColors[color.toLowerCase()] || color;
  
  // For hex colors
  if (hexColor.startsWith("#")) {
    const hex = hexColor.substring(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }
    // Default to dark for unknown colors
  return false;
}

// Add default export
export default ClosetView;
