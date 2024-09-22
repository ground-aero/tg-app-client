import React, { useState, useEffect, useCallback } from 'react';

const WeatherLocationDropdown = ({ weatherLocation, setWeatherLocation, fetchWeatherData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cities = ['Moscow', 'Krasnodar', 'Smolensk', 'Ruza', 'Gelendzhik', 'Los-angeles'];

  const handleCitySelect = useCallback((city) => {
    setWeatherLocation(city);
    setIsDropdownOpen(false);
  }, [setWeatherLocation]);

  useEffect(() => {
    if (weatherLocation) {
      fetchWeatherData();
    }
  }, [weatherLocation, fetchWeatherData]);

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="dropdown-toggle"
      >
        {weatherLocation ? `Выбран город: ${weatherLocation} (v)` : `Выбрать город... (v)`}
      </button>
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {cities.map((city) => (
            <li key={city} onClick={() => handleCitySelect(city)} className="dropdown-item">
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherLocationDropdown;