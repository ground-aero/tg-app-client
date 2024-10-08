import React, {useEffect, useState, useCallback} from 'react'
import './App.css';
import Button from './components/Button/Button';
import { useTelegram } from './hooks/useTelegram';
import {formatDate} from './utils/formatDate';
import WeatherLocationDropdown from './components/WeatherLocationDropdown/WeatherLocationDropdown';
import { Route, Routes } from 'react-router-dom';

const API_BASE_URL = 'https://tg-app-online.ru';
// const API_BASE_URL = 'http://localhost:4000';

function App() {
  const {tg, user, onClose} = useTelegram();
  const [activePage, setActivePage] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState('');
  const [forecastLocation, setForecastLocation] = useState('');
    // const [loadedCity, setLoadedCity] = useState('Moscow');
  const [forecastData, setForecastData] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingForecast, setIsFetchingForecast] = useState(false);
  const [loadedDays, setLoadedDays] = useState(5);

  const [ws, setWs] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!weatherLocation) {
      return;
    }
  
    setIsFetchingLocation(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather?city=${weatherLocation}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Ошибка запроса weather data:', error);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [weatherLocation]);

  const fetchForecastData = useCallback(async () => {
    setIsFetchingForecast(true);
    try {
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
    } finally {
      setIsFetchingForecast(false);
    }
  }, [loadedDays]);

  useEffect(() => {
    tg.ready()
  },[])

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageWithUser = JSON.stringify({
        message: message,
        username: user?.username,
      })
    console.log(messageWithUser)
      ws.send(messageWithUser);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage.trim())
    setInputMessage('')
  };
  
  useEffect(() => {
    // const newWs = new WebSocket('ws://localhost:4000');
    const newWs = new WebSocket(`${API_BASE_URL.replace('https', 'wss')}`);
    newWs.onopen = () => {
      console.log('WebSocket connected');
    };
      newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    // Обработчик входящих сообщений
    newWs.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.text()
        .then(text => {
          const parsedMessage = JSON.parse(text);
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, parsedMessage]
            localStorage.setItem('chatMessages', JSON.stringify(updatedMessages))
            return updatedMessages;
          });
        });
      } else {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, parsedMessage];
          localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }
    };
    setWs(newWs);

  const storedMessages = localStorage.getItem('chatMessages');
  if (storedMessages ) {
    setMessages(JSON.parse(storedMessages));
  }

  return () => {
    if (newWs.readyState === WebSocket.OPEN) {
      newWs.close();
    }
  };
  }, []);

  useEffect(() => {
    if (activePage === 2 && weatherLocation) {
      fetchWeatherData();
    }
  }, [activePage, fetchWeatherData, weatherLocation]);

  useEffect(() => {
    if (activePage === 3) {
      fetchForecastData();
    }
  }, [activePage, fetchForecastData, loadedDays]);
  
  const loadMoreForecast = () => {
    setLoadedDays((prevDays) => prevDays + 3);
  };

  return (
    <div className={'pageContent'}>

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
        <main>
          <span>{`Пользователь: @${user?.username}`}</span>
          <h2>Chat</h2>
          <div className={'inputBox'}>
            <input
              type="text" placeholder={'Введите сообщение'} className={'input'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button type="buttonSecondary" onClick={handleSendMessage} className={'buttonSend'}></button>
          </div>
          <div>
            {messages.map((message, index) => (
                <p key={index}><span>{`@${message.username}:  `}</span>{typeof message === 'string' ? message.message : JSON.stringify(message.message)}</p>
            ))}
          </div>
        </main>
      )}

      {activePage === 2 && (
        <main>
          <WeatherLocationDropdown 
            weatherLocation={weatherLocation}
            setWeatherLocation={setWeatherLocation}
            fetchWeatherData={fetchWeatherData}
          />

          <h2>Погода: {weatherLocation}</h2>

          {isFetchingLocation ? (
              <p>Загрузка данных о погоде...<img className={'preloader'}></img></p>
            ) : weatherData ? (
              <div className={'cardWeather'}>
                <h3>{"Сейчас:"}</h3>
                <div className={'boxImgAndTemp'}>
                  <img src={weatherData.current.condition.icon} className={'ImgWeather'} alt={weatherData.current.condition.text} />
                  <p className={'tempText'}>{weatherData.current.temp_c}</p>
                  <span className={'tempTextC'}>°C</span>
                </div>
                <p>Условия: {weatherData.current.condition.text}</p>
                <hr/>
                <p>Ветер: {weatherData.current.wind_kph}км/ч</p>
                <p>Облачность: {weatherData.current.cloud}</p>
                <p>Влажность: {weatherData.current.humidity}</p>
                <p>Видимость: {weatherData.current.vis_km}км.</p>
                <p>Давление: {weatherData.current.pressure_mb}м.бар</p>
                <p>Индекс ультрафиолета: {weatherData.current.uv}</p>
              </div>
            ) : (
              <>
                <p className={'weatherText'}>Выберите город для просмотра погоды</p>
                <img className={'weatherIcon'}></img>
              </>
           )}
        </main>
      )}

      {activePage === 3 && (
        <main className={'mainContent'}>
          <h2>Прогноз: {forecastLocation}</h2>
          {forecastData.map((day, index) => (
            <div key={index} className={'cardWeather'}>
              <h3>{formatDate(day.date)}</h3>
              <img src={day.day.condition.icon} alt={day.day.condition.text} />
              <p>Mакс t: {day.day.maxtemp_c}°C</p>
              <p>Мин t: {day.day.mintemp_c}°C</p>
              <p>Вероятность дождя: {day.day.daily_chance_of_rain}%</p>
              <p>Условия: {day.day.condition.text}</p>
            </div>
          ))}
          <button 
            onClick={loadMoreForecast} 
            className={'buttonSecondary'}
            disabled={isFetchingForecast}
          >
            {isFetchingForecast ? 'Загрузка...' : 'Загрузить еще...'}
          </button>
        </main>
      )}

      <div className={'buttonsBottom'}>
        <Button onClick={() => setActivePage(1)}>Chat</Button>
        <Button onClick={() => setActivePage(2)}>Weather</Button>
        <Button onClick={() => setActivePage(3)}>Forecast</Button>
      </div>
    </div>
  );
}

export default App;
