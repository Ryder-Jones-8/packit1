"use client";

import React from 'react';
import { useTheme } from '@/lib/context/ThemeContext';

interface ThemeOption {
  name: string;
  value: 'default' | 'dark' | 'pink' | 'forest';
  icon: React.ReactNode;
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeOptions: ThemeOption[] = [
    {
      name: 'Default',
      value: 'default',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      )
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )
    },
    {
      name: 'Pink',
      value: 'pink',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      )
    },
    {
      name: 'Forest',
      value: 'forest',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19 3 10.69V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18v-7.31l-3.115-5.5A2.25 2.25 0 0 0 16.05 4H7.95A2.25 2.25 0 0 0 6.115 5.19Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="theme-toggle">
      <div className="bg-background-card shadow-md rounded-lg p-2 flex gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex items-center justify-center p-2 rounded-md transition-colors ${
              theme === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-background-hover'
            }`}
            title={`Switch to ${option.name} theme`}
            aria-label={`Switch to ${option.name} theme`}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
