import React, { useState } from 'react';

const WeatherLocationDropdown = ({ weatherLocation, setWeatherLocation, fetchWeatherData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cities = ['Moscow', 'Krasnodar', 'Smolensk', 'Ruza', 'Gelendzhik'];

  const handleCitySelect = (city) => {
    setWeatherLocation(city);
    setIsDropdownOpen(false);
    fetchWeatherData();
  };

  return (
    <div className="dropdown">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="dropdown-toggle"
      >
        {weatherLocation || 'Выбрать локацию...'}
      </button>
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {cities.map((city) => (
            <li key={city} onClick={() => handleCitySelect(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherLocationDropdown;