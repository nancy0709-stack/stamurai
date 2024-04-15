import React, { useEffect, useState } from 'react';
import type { City, WeatherData } from '../types/WeatherTypes';
import { fetchWeatherData } from '../utils/api';

interface CityTableProps {
  cities: City[];
  onSelectCity: (city: City) => void;
}

const CityTable: React.FC<CityTableProps> = ({ cities }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherForSelectedCity = async () => {
      if (selectedCity) {
        const weatherData = await fetchWeatherData(selectedCity.name);
        setWeatherData(weatherData);
      }
    };

    fetchWeatherForSelectedCity();
  }, [selectedCity]);

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
            <th>Timezone</th>
            <th>Weather</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id} onClick={() => handleCityClick(city)}>
              <td>{city.name}</td>
              <td>{city.country}</td>
              <td>{city.timezone}</td>
              <td>{weatherData?.temperature ?? 'Loading...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCity && (
        <div>
          <h2>{selectedCity.name}</h2>
          <p>{weatherData ? `Temperature: ${weatherData.temperature}°C` : 'Loading...'}</p>
          {/* Add more weather details */}
        </div>
      )}
    </div>
  );
};

export default CityTable;
