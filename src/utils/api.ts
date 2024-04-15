import axios from 'axios';
import { WeatherData } from "../types/WeatherTypes";
import { Forecast } from "../types/WeatherTypes";
const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=1000&facet=cou_name_en&sort=name';

export const fetchCities = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}?disjunctive.cou_name_en&sort=name`);
    return response.data.records;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return []; 
  }
};


export const fetchWeatherData = async (cityName: string): Promise<WeatherData> => {
  const response = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return {
    temperature: data.main.temp,
    weatherDescription: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
  };
};

export const fetchForecastData = async (cityName: string): Promise<Forecast[]> => {
  const response = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return data.list.map((item: any) => ({
    date: item.dt_txt,
    temperatureHigh: item.main.temp_max,
    temperatureLow: item.main.temp_min,
    weatherDescription: item.weather[0].description,
    precipitationChance: item.pop * 100, 
  }));
};
