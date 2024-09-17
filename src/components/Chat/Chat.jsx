import React, { useEffect, useState } from 'react';

export default function WebSocketComponent() {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket('wss://tg-app-online.ru/ws');

    newWs.onopen = () => {
      console.log('WebSocket connected');
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newWs.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    setWs(newWs);

    return () => {
      if (newWs.readyState === WebSocket.OPEN) {
        newWs.close();
      }
    };
  }, []);

  return (
    <div>
      {/* UI */}
    </div>
  );
}