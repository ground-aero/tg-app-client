// window.Telegram.WebApp.
import React, {useEffect} from 'react'
import './App.css';

const tg = window.Telegram.WebApp;

function App() {

  useEffect(() => {
    tg.ready()
  },[])

  const onClose = () => {
    tg.close
  }

  return (
    <div className="App">
      <h1>Приложение "3 в одном"</h1>

      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
