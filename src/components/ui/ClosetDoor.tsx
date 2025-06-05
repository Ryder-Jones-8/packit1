"use client";

import { motion } from "framer-motion";
import { Season } from "@/lib/types/clothing";
import { useTheme } from "@/lib/context/ThemeContext";

interface ClosetDoorProps {
  season: Season;
  isOpen: boolean;
  onToggle: (event?: React.MouseEvent) => void;
  children: React.ReactNode;
}

// Theme color mapping
const themeFrameColors = {
  default: "bg-amber-800",
  dark: "bg-slate-900",
  pink: "bg-pink-900",
  forest: "bg-emerald-900"
};

const themeDoorColors = {
  default: "bg-amber-100",
  dark: "bg-slate-800",
  pink: "bg-pink-100",
  forest: "bg-emerald-100"
};

const themeDoorHandleColors = {
  default: "bg-amber-900",
  dark: "bg-slate-950",
  pink: "bg-pink-800",
  forest: "bg-emerald-950"
};

const themeGrainColors = {
  default: "bg-amber-900/20",
  dark: "bg-slate-300/20",
  pink: "bg-pink-900/20",
  forest: "bg-emerald-950/20"
};

const themeLabelTextColors = {
  default: "text-amber-900",
  dark: "text-slate-100",
  pink: "text-pink-900",
  forest: "text-emerald-900"
};

// Seasonal color mapping
const seasonColors: Record<Season, { bgFrom: string, bgTo: string, accent: string, decoration: string }> = {
  spring: { 
    bgFrom: "from-green-200", 
    bgTo: "to-lime-50", 
    accent: "bg-green-500",
    decoration: "border-green-600"
  },
  summer: { 
    bgFrom: "from-blue-200", 
    bgTo: "to-cyan-50", 
    accent: "bg-blue-500",
    decoration: "border-blue-600"
  },
  fall: { 
    bgFrom: "from-orange-200", 
    bgTo: "to-amber-50", 
    accent: "bg-orange-500",
    decoration: "border-orange-600"
  },
  winter: { 
    bgFrom: "from-blue-300", 
    bgTo: "to-slate-100", 
    accent: "bg-blue-700",
    decoration: "border-blue-800"
  },
  all: { 
    bgFrom: "from-gray-200", 
    bgTo: "to-white", 
    accent: "bg-gray-500",
    decoration: "border-gray-600"
  }
};

export const ClosetDoor = ({ season, isOpen, onToggle, children }: ClosetDoorProps) => {
  const { theme } = useTheme();
  const { bgFrom, bgTo, accent, decoration } = seasonColors[season];
  
  // Variants for left door
  const leftDoorVariants = {
    open: { rotateY: 105, x: -20, boxShadow: "10px 0 15px rgba(0, 0, 0, 0.1)" },
    closed: { rotateY: 0, x: 0, boxShadow: "none" }
  };
  
  // Variants for right door
  const rightDoorVariants = {
    open: { rotateY: -105, x: 20, boxShadow: "-10px 0 15px rgba(0, 0, 0, 0.1)" },
    closed: { rotateY: 0, x: 0, boxShadow: "none" }
  };  return (
    <div className="relative mb-8 rounded-lg overflow-hidden shadow-xl">
      {/* Closet frame with subtle woodgrain texture */}
      <div className={`absolute inset-0 ${themeFrameColors[theme]} rounded-lg`} style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h1v100H0zM10 0h1v100h-1zM20 0h1v100h-1zM30 0h1v100h-1zM40 0h1v100h-1zM50 0h1v100h-1zM60 0h1v100h-1zM70 0h1v100h-1zM80 0h1v100h-1zM90 0h1v100h-1z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`,
        padding: '8px'
      }} />
      
      {/* Closet top shelf/pole shadow */}
      <div className={`absolute top-0 left-0 right-0 h-3 ${theme === 'dark' ? 'bg-black' : 'bg-opacity-20'} rounded-t-lg z-10`} />{/* Closet interior with seasonal gradient */}
      <div className={`relative p-8 pb-10 bg-gradient-to-br ${bgFrom} ${bgTo} rounded-lg min-h-[18rem] z-0`}>        {/* Interior content (clothing items) */}
        <div 
          className={`transition-opacity duration-300 relative ${isOpen ? "opacity-100 z-30" : "opacity-0 pointer-events-none"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
          {/* Closet doors container */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {/* Left door */}
          <motion.div 
            className={`absolute top-0 bottom-0 left-0 w-1/2 ${themeDoorColors[theme]} bg-opacity-95 cursor-pointer`}
            variants={leftDoorVariants}
            animate={isOpen ? "open" : "closed"}
            initial="closed"            
            transition={{ type: "spring", stiffness: 70, damping: 20 }}            
            style={{ 
              transformStyle: "preserve-3d", 
              perspective: "1000px", 
              transformOrigin: "left center",
              borderRight: "1px solid rgba(146, 64, 14, 0.2)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggle(e);
            }}
          >
            {/* Door handle */}
            <div className={`absolute top-1/2 right-5 w-3 h-12 ${themeDoorHandleColors[theme]} rounded-full transform -translate-y-1/2 z-10 shadow-md`} />
            
            {/* Wood grain pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="h-full w-full flex flex-col justify-between">
                {Array(12).fill(0).map((_, idx) => (
                  <div key={`left-grain-${idx}`} className={`h-px ${themeGrainColors[theme]}`} />
                ))}
              </div>
            </div>
            
            {/* Door panel with seasonal accent */}
            <div className={`absolute inset-5 border-2 ${decoration} rounded-md overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-12 ${accent} opacity-80`} />
            </div>              {/* Season emblem - left side */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80">
              <div className={`w-14 h-14 ${accent} rounded-full flex items-center justify-center shadow-md border-2 border-white`}>
                {getSeasonIconLeft(season)}
              </div>
            </div>
          </motion.div>
            {/* Right door */}
          <motion.div 
            className={`absolute top-0 bottom-0 right-0 w-1/2 ${themeDoorColors[theme]} bg-opacity-95 cursor-pointer`}
            variants={rightDoorVariants}
            animate={isOpen ? "open" : "closed"}
            initial="closed"            
            transition={{ type: "spring", stiffness: 70, damping: 20 }}            
            style={{ 
              transformStyle: "preserve-3d", 
              perspective: "1000px", 
              transformOrigin: "right center",
              borderLeft: "1px solid rgba(146, 64, 14, 0.2)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggle(e);
            }}
          >
            {/* Door handle */}
            <div className={`absolute top-1/2 left-5 w-3 h-12 ${themeDoorHandleColors[theme]} rounded-full transform -translate-y-1/2 z-10 shadow-md`} />
            
            {/* Wood grain pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="h-full w-full flex flex-col justify-between">
                {Array(12).fill(0).map((_, idx) => (
                  <div key={`right-grain-${idx}`} className={`h-px ${themeGrainColors[theme]}`} />
                ))}
              </div>
            </div>
            
            {/* Door panel with seasonal accent */}
            <div className={`absolute inset-5 border-2 ${decoration} rounded-md overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-12 ${accent} opacity-80`} />
            </div>              {/* Season emblem - right side */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80">
              <div className={`w-14 h-14 ${accent} rounded-full flex items-center justify-center shadow-md border-2 border-white`}>
                {getSeasonIconRight(season)}
              </div>
            </div>
          </motion.div>
            {/* Season label (centered between doors) */}
          {!isOpen && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-20">
              <span className={`text-2xl font-bold uppercase tracking-wide ${themeLabelTextColors[theme]} shadow-sm px-4 py-2 bg-white bg-opacity-70 rounded-lg`}>
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </span>
              <div className={`mt-3 bg-white bg-opacity-80 px-3 py-1 rounded-full ${themeLabelTextColors[theme]} text-sm font-medium animate-pulse`}>
                Click to Open
              </div>
            </div>
          )}
        </div>      </div>
    </div>
  );
};

// Helper function to render season-specific icons for the left door
function getSeasonIconLeft(season: Season) {
  switch (season) {    case 'spring':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 6C12 6 12 2 16 2C20 2 20 6 20 6C20 6 20 10 16 10C14.5 10 14 9 12 6Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 9C8 9 8 5 4 5C0 5 0 9 0 9C0 9 0 13 4 13C5.5 13 6 12 8 9Z" strokeLinecap="round" strokeLinejoin="round" transform="translate(4, 5)" />
          <path d="M12 22L12 10M9 14L12 12L15 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'summer':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'fall':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8L12 12M12 16L12 12M12 12L16 8M12 12L8 8" strokeLinecap="round" />
          <path d="M5 21L8 14M19 21L16 14" strokeLinecap="round" />
        </svg>
      );
    case 'winter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L12 22M12 22L8 18M12 22L16 18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5 6.5L12 12L6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 12L4 12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5 17.5L12 12L6.5 17.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default: // 'all'
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="7" />
          <path d="M12 5L12 3M12 21L12 19M5 12L3 12M21 12L19 12M18.36 18.36L16.95 16.95M18.36 5.64L16.95 7.05M5.64 18.36L7.05 16.95M5.64 5.64L7.05 7.05" strokeLinecap="round" />
        </svg>
      );
  }
}

// Helper function to render season-specific icons for the right door
function getSeasonIconRight(season: Season) {
  switch (season) {    case 'spring':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8C12 8 16 0 18 0C20 0 24 4 24 6C24 8 16 12 16 12C16 12 20 20 18 22C16 24 12 20 10 20C8 20 4 24 2 22C0 20 4 16 4 16C4 16 0 12 0 10C0 8 4 4 6 4C8 4 12 8 12 8Z" transform="translate(0, 1) scale(0.75)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12L12 22M9 18L12 22L15 18" strokeLinecap="round" />
        </svg>
      );
    case 'summer':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.5L14.4 9.5H21.5L15.8 13.9L18.2 20.9L12 16.4L5.8 20.9L8.2 13.9L2.5 9.5H9.6L12 2.5Z" />
        </svg>
      );
    case 'fall':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 20C6 20 2 16 2 11M2 11C2 6 6 2 11 2M11 2C16 2 20 6 20 11M20 11C20 16 16 20 11 20" strokeLinecap="round" />
          <path d="M14 14L20 20M4 20L10 14" strokeLinecap="round" />
        </svg>
      );
    case 'winter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3V21M9 18L12 21L15 18M4 9L21 9M4 15L21 15" strokeLinecap="round" />
        </svg>
      );
    default: // 'all'
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">          <circle cx="12" cy="8" r="5" />
          <path d="M12 13V21M10 15H14M7 10H17" strokeLinecap="round" />
        </svg>
      );
  }
}

// Add default export
export default ClosetDoor;