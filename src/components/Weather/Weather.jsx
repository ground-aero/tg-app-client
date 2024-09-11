import React from 'react'
import './Weather.css'

const Weather = () => {
    <section>
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
    </section>
}

export default Weather