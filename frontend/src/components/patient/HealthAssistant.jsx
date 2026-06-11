import { useState } from 'react';
import api from '../../utils/api.js';
import DoctorCard from '../common/DoctorCard.jsx';

export default function HealthAssistant() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Share your symptoms for doctor suggestions (not a diagnosis).' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await api.post('/assistant/suggestions', { symptoms: input });
      const assistantMsg = {
        role: 'assistant',
        content: response.data.disclaimer,
        suggestions: response.data.suggestions,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, could not get suggestions.' }]);
    }
  };

  return (
    <div className="h-96 flex flex-col border rounded bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <p>{msg.content}</p>
              {msg.suggestions && (
                <div className="mt-2 space-y-2">
                  {msg.suggestions.map((doc, j) => (
                    <DoctorCard key={j} doctor={doc} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded-l"
          placeholder="Describe symptoms..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">Send</button>
      </div>
    </div>
  );
}