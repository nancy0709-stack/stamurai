export interface WeatherData {
    temperature: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  }
  
  export interface City {
    id: number;
    name: string;
    country: string;
    timezone: string;
    weather?: WeatherData;
  }
  
  export interface Forecast {
    date: string;
    temperatureHigh: number;
    temperatureLow: number;
    weatherDescription: string;
    precipitationChance: number;
  }
  