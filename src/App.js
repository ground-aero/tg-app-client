// import ReactDOM from 'react-dom/client';
import React, {useEffect, useState} from 'react'
import './App.css';

const tg = window.Telegram.WebApp;
const API_BASE_URL = 'https://your-backend-url.com';
// const API_BASE_URL = 'http://localhost:4000';

function App() {
  const [activePage, setActivePage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loadedDays, setLoadedDays] = useState(3);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    tg.ready()
  },[])

  useEffect(() => {
    // const newWs = new WebSocket('ws://localhost:3000');
    const newWs = new WebSocket(`${API_BASE_URL.replace('https', 'wss')}`);

    newWs.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.text().then(text => {
          setMessages((prevMessages) => [...prevMessages, text]);
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };
    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  const onClose = () => {
    tg.close
  }

  useEffect(() => {
    if (activePage === 2) {
      fetchWeatherData();
    } else if (activePage === 3) {
      fetchForecastData();
    }
  }, [activePage, loadedDays]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Ошибка запроса weather data:', error);
      console.error('Полная информация об ошибке:', error.message);
    }
  };

  const fetchForecastData = async () => {
    try {
      // const response = await fetch(`/api/forecast?days=${loadedDays}`);
      const response = await fetch(`${API_BASE_URL}/api/forecast?days=${loadedDays}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setForecastData(data.forecast.forecastday);
    } catch (error) {
      console.error('ошибка запроса forecast data:', error);
    }
  };

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  const loadMoreForecast = () => {
    setLoadedDays((prevDays) => prevDays + 3);
  };

  return (
    <div>

      <h1>Приложение "3 в одном"</h1>

      {activePage === 1 && (
        <div>
          <h2>Chat</h2>
          <div>
            {messages.map((message, index) => (
              <p key={index}>{typeof message === 'string' ? message : JSON.stringify(message)}</p>
            ))}
          </div>
          <input
            type="text"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      )}

      {activePage === 2 && (
        <div>
          <h2>Weather in Moscow</h2>
          {weatherData && (
            <div>
              <p>Temperature: {weatherData.current.temp_c}°C</p>
              <p>Condition: {weatherData.current.condition.text}</p>
            </div>
          )}
        </div>
      )}

      {activePage === 3 && (
        <div>
          <h2>Forecast</h2>
          {forecastData.map((day, index) => (
            <div key={index}>
              <h3>{day.date}</h3>
              <p>Max temp: {day.day.maxtemp_c}°C</p>
              <p>Min temp: {day.day.mintemp_c}°C</p>
              <p>Condition: {day.day.condition.text}</p>
            </div>
          ))}
          <button onClick={loadMoreForecast}>Load More</button>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <button onClick={() => setActivePage(1)}>Chat1</button>
        <button onClick={() => setActivePage(2)}>Weather</button>
        <button onClick={() => setActivePage(3)}>Forecast</button>
      </div>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
// ReactDOM.render(<App />, document.getElementById('root'));
