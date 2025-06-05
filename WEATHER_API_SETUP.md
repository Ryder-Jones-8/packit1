# Setting Up Weather API

This application uses OpenWeatherMap API to provide accurate weather forecasts for your trips. Follow these steps to set it up:

## Getting an OpenWeather API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/) and create a free account if you don't have one.
2. After logging in, go to your API keys section (found in "My API Keys" or under your profile).
3. Generate a new API key or use your existing one.
4. Copy your API key.

## Setting up the API Key in the Application

1. In the root directory of the project, create a file named `.env.local` if it doesn't exist.
2. Add the following line to the file:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

3. Replace `your_api_key_here` with the API key you copied.
4. Restart your development server.

## Important Notes

- The free tier of OpenWeatherMap API allows for up to 1,000 API calls per day.
- We use the 5-day forecast API which returns data in 3-hour intervals.
- The application will automatically fall back to mock data if the API call fails or if no API key is provided.
- Weather data is automatically refreshed when you view a trip, or you can click "Refresh Forecast" to update manually.
