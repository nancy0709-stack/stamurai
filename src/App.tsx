import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CityTable from './components/CityTable';
import WeatherPage from './components/WeatherPage';

interface City {
  id: number;
  name: string;
  country: string;
  timezone: string;
}

interface WeatherData {
  temperature: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

interface Forecast {
  date: string;
  temperatureHigh: number;
  temperatureLow: number;
  weatherDescription: string;
  precipitationChance: number;
}

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=1000&facet=cou_name_en&sort=name';

const App: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(BASE_URL);
        const data = response.data;
        const processedCities: City[] = data.records.map((record: any) => ({
          id: record.recordid,
          name: record.fields.name,
          country: record.fields.cou_name_en,
          timezone: record.fields.timezone,
        }));
        setCities(processedCities);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };

    fetchCities();
  }, []);
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (selectedCity) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${BASE_URL}/weather?q=${selectedCity.name}&appid=${API_KEY}&units=metric`);
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
          setError('Error fetching weather data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchForecastData = async () => {
      if (selectedCity) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${BASE_URL}/forecast?q=${selectedCity.name}&appid=${API_KEY}&units=metric`);
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
          setError('Error fetching forecast data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
    fetchForecastData();
  }, [selectedCity]);

  return (
    <div className="App">
      <h1>Weather Forecast Application</h1>
      <CityTable cities={cities} onSelectCity={handleCitySelect} />
      {error && <div>Error: {error}</div>}
      {selectedCity && weatherData && forecastData.length > 0 && (
        <WeatherPage
          city={selectedCity}
          weatherData={weatherData}
          forecastData={forecastData}
        />
      )}
    </div>
  );
}

export default App;
