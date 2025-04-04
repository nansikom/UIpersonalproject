import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const UI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Create a high-fidelity prototype design using Tailwind CSS classes. Focus on:
                - Layout structure
                - Bright Colors pairs only that are attractive to customers.
                - Typography
                - Spacing and alignment
                - Responsive design
                - Interactive elements
                - Organise elements in a modert website format plan.
                Return only the HTML/JSX structure with Tailwind classes.`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiMessage = {
        text: data.choices[0].message.content,
        isUser: false,
        isPrototype: true
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't generate the prototype. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex-col h-screen bg-gray-100">
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Web UI Prototype Generator</h1>
        <p className="text-sm text-gray-500">Describe your web page and get an instant prototype</p>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        <div className="w-1/2 overflow-y-auto p-4 border-r">
          {messages.map((message, index) => (
            <div key={index} className="mb-4">
              {message.isUser ? (
                <div className="bg-blue-500 text-white p-3 rounded-lg">
                  {message.text}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow">
                  <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                    {message.text}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-1/2 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            !message.isUser && message.isPrototype && (
              <div key={index} className="mb-4 prototype-preview"
                   dangerouslySetInnerHTML={{ __html: message.text }} />
            )
          ))}
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe the web page you want to create..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        {isLoading && (
          <div className="text-sm text-gray-500 mt-2">
            Generating prototype...
          </div>
        )}
      </div>
    </div>
  );
};

export default UI;
