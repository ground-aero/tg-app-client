// import ReactDOM from 'react-dom/client';
import React, {useEffect, useState} from 'react'
import './App.css';
import Button from './components/Button/Button';
import { useTelegram } from './hooks/useTelegram';
import { Route, Routes } from 'react-router-dom';
import Weather from './components/Weather/Weather';

const tg = window.Telegram.WebApp;
const API_BASE_URL = 'https://tg-app-online.ru';
// const API_BASE_URL = 'http://localhost:4000';

function App() {
  const [activePage, setActivePage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLocation, setweatherLocation] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [forecastLocation, setForecastLocation] = useState('');
  const [loadedDays, setLoadedDays] = useState(3);
  const [ws, setWs] = useState(null);

  const {tg, user, onClose} = useTelegram();

  useEffect(() => {
    tg.ready()
  },[])

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  useEffect(() => {
    // const newWs = new WebSocket('ws://localhost:4000');
    const newWs = new WebSocket('wss://tg-app-online.ru');
    // const newWs = new WebSocket('ws://tg-app-online.ru');
    // const newWs = new WebSocket(`${API_BASE_URL.replace('https', 'wss')}`);

    newWs.onopen = () => {
      console.log('WebSocket connected');
    };
  
    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

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
    if (newWs.readyState === WebSocket.OPEN) {
      newWs.close();
    }
  };
  }, []);

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
      setweatherLocation(data.location.name);
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
      setForecastLocation(data.location.name);
    } catch (error) {
      console.error('ошибка запроса forecast data:', error);
    }
  };

  const loadMoreForecast = () => {
    setLoadedDays((prevDays) => prevDays + 3);
  };

  return (
    <div className={'pageContent'}>

      {/* <button onClick={onClose}>Закрыть</button> */}
      <div className={'btnClose'}>
        <Button onClick={onClose}>Закрыть</Button>
      </div>

      {/* future <Header /> */}
      <h1 className={'header'}>Приложение "3 в одном"</h1>

      {/* <Routes>
        <Route path="/" exact/> */}
        {/* <Route index element={<Chats/>}/> */}
        {/* <Route path="weather" element={<Weather/>}/> */}
        {/* <Route path="forecastr" element={<Forecast/>}/> */}
      {/* </Routes> */}

      {activePage === 1 && (
        <div>
          <h2>Chat</h2>
          <div>
            {messages.map((message, index) => (
              <p key={index}>{typeof message === 'string' ? message : JSON.stringify(message)}</p>
            ))}
          </div>
          <input
            type="text" placeholder={'Ваше сообщение'} className={'input'}
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
          <h2>Погода: {weatherLocation}</h2>
          {weatherData && (
            <div className={'cardWeather'}>
              <h3>{'Сегодня'}</h3>
              <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
              <p>Temperature: {weatherData.current.temp_c}°C</p>
              <p>Condition: {weatherData.current.condition.text}</p>            
            </div>
          )}
        </div>
      )}

      {activePage === 3 && (
        <div>
          <h2>Прогноз: {forecastLocation}</h2>
          {forecastData.map((day, index) => (
            <div key={index} className={'cardWeather'}>
              <h3>{day.date}</h3>
              <p>Max temp: {day.day.maxtemp_c}°C</p>
              <img src={day.day.condition.icon} alt={day.day.condition.text} />
              <p>Max temp: {day.day.maxtemp_c}°C</p>
              <p>Min temp: {day.day.mintemp_c}°C</p>
              <p>Condition: {day.day.condition.text}</p>
            </div>
          ))}
          <button onClick={loadMoreForecast} className={'buttonSecondary'}>Загрузить еще...</button>
        </div>
      )}

      <div className={'buttonsBottom'}>
        <Button onClick={() => setActivePage(1)}>Chat</Button>
        {/* <button onClick={() => setActivePage(1)}></button> */}
        <Button onClick={() => setActivePage(2)}>Weather</Button>
        {/* <button onClick={() => setActivePage(3)}>Forecast</button> */}
        <Button onClick={() => setActivePage(3)}>Forecast</Button>
      </div>
      <span>
        {`Пользователь: @${user?.username}`}
      </span>
    </div>
  );
}

export default App;
// ReactDOM.render(<App />, document.getElementById('root'));
