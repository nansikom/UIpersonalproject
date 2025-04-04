import { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(false);
  
  const API_KEY = "2c57acafdf15c70b80041e915211f65a";

  const testApiConnection = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=51.5074&lon=-0.1278&units=metric&APPID=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.cod !== 200) {
        console.error('API Error:', data.message);
        setApiStatus(false);
        return;
      }
      console.log('API is working!');
      setApiStatus(true);
    } catch (error) {
      console.error('API Connection Error:', error);
      setApiStatus(false);
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // First, get coordinates for the city
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData.length) {
        throw new Error('City not found');
      }

      // Then get weather using coordinates
      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await weatherResponse.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const weatherInfo = `Weather in ${data.name}, ${data.sys.country}: 
        Temperature: ${data.main.temp}°C (${(data.main.temp * 9/5 + 32).toFixed(1)}°F)
        Condition: ${data.weather[0].description}
        Humidity: ${data.main.humidity}%
        Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h
        Coordinates: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;

      const aiMessage = { text: weatherInfo, isUser: false };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: "Sorry, I couldn't find weather for that location. Please try another city.", 
        isUser: false 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Weather Chat</h1>
        <div className={`text-sm ${apiStatus ? 'text-green-500' : 'text-red-500'}`}>
          {apiStatus ? 'API Connected' : 'API Not Connected'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg p-3">
              Checking weather...
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 shadow-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter a city name..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
