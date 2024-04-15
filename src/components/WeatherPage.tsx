import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WeatherData, Forecast } from '../types/WeatherTypes';

interface WeatherPageProps {
  city: {
    id: number;
    name: string;
    country: string;
    timezone: string;
  };
  weatherData: WeatherData | null;
  forecastData: Forecast[];
}

const WeatherPage: React.FC<WeatherPageProps> = ({ city }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/weather?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        const data = response.data;
        const weather: WeatherData = {
          temperature: data.main.temp,
          weatherDescription: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
        };
        setWeatherData(weather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const fetchForecastData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/forecast?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        const data = response.data;
        const forecast: Forecast[] = data.list.map((item: any) => ({
          date: item.dt_txt,
          temperatureHigh: item.main.temp_max,
          temperatureLow: item.main.temp_min,
          weatherDescription: item.weather[0].description,
          precipitationChance: item.pop * 100, // Probability of precipitation
        }));
        setForecastData(forecast);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchWeatherData();
    fetchForecastData();
  }, [city, API_KEY, BASE_URL]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div>
      <h1>{city.name} Weather</h1>
      <div>
        <h2>Current Weather</h2>
        <p>Temperature: {weatherData.temperature} °C</p>
        <p>Weather: {weatherData.weatherDescription}</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        <p>Pressure: {weatherData.pressure} hPa</p>
      </div>
      {forecastData.length > 0 && (
        <div>
          <h2>5-Day Forecast</h2>
          <ul>
            {forecastData.map((forecast, index) => (
              <li key={index}>
                Date: {forecast.date}, High: {forecast.temperatureHigh}°C, Low: {forecast.temperatureLow}°C,{' '}
                Description: {forecast.weatherDescription}, Precipitation: {forecast.precipitationChance}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
