"use client";

import { useState } from 'react';
import { fetchRealWeatherData } from '@/lib/services/weatherService';
import { WeatherForecast } from '@/lib/types/trip';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';

export default function WeatherTestPage() {
  const [location, setLocation] = useState('London');
  const [days, setDays] = useState(5);
  const [weatherData, setWeatherData] = useState<WeatherForecast[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  const testWeatherAPI = async () => {
    setLoading(true);
    setError('');
    
    // Check if we have a non-empty location
    if (!location.trim()) {
      setError('Please enter a valid location');
      setLoading(false);
      return;
    }
    
    try {
      const data = await fetchRealWeatherData(location, days);
      
      if (!data || data.length === 0) {
        setError('No weather data returned. This might be an issue with the API key or location.');
        setWeatherData(null);
      } else {
        setWeatherData(data);
        console.log('Weather data successfully fetched:', data);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(`Error fetching weather data: ${errorMessage}`);
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar activePage="home" />
      <main className="container mx-auto px-4 py-8">
        <PageHeader title="Weather API Testing" />        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4 text-sm bg-blue-50 p-3 rounded">
            <p><strong>Current Date:</strong> {new Date().toLocaleDateString()} ({new Date().toLocaleTimeString()})</p>
            <p className="text-gray-600 mt-1">Weather forecasts will be retrieved based on the current date.</p>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter location (e.g. London, New York)"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Days:</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              min="1"
              max="5"
              className="border rounded px-3 py-2 w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Free tier allows up to 5 days forecast
            </p>
          </div>

          <button
            onClick={testWeatherAPI}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <span className="inline-block mr-2">Fetching...</span>
                <span className="inline-block animate-pulse">⏳</span>
              </>
            ) : 'Test Weather API'}
          </button>

          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}
        </div>{weatherData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Weather Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData.map((day, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium mb-1">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-bold">
                    {day.minTemp}°F - {day.maxTemp}°F
                  </p>
                  <p className="capitalize mb-2">{day.condition}</p>
                  <p>Precipitation: {day.precipitation}%</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">Raw Data:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(weatherData, (key, value) => {
                  if (key === 'date') {
                    return new Date(value).toISOString();
                  }
                  return value;
                }, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
