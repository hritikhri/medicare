import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store.js';
import { useSocket } from '../../hooks/useSocket.js';

export default function ChatWindow({ appointmentId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const userId = useSelector((state) => state.auth.user?.id);
  const socket = useSocket(userId);

  useEffect(() => {
    if (socket) {
      socket.emit('join_chat', { appointmentId, userId });
      socket.on('new_message', ({ message }) => setMessages(prev => [...prev, message]));
      socket.on('user_typing', ({ isTyping }) => setIsTyping(isTyping));
    }

    return () => {
      socket?.off('new_message');
      socket?.off('user_typing');
    };
  }, [socket, appointmentId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('send_message', { appointmentId, content: input, senderId: userId });
    setInput('');
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { appointmentId, isTyping: e.target.value.length > 0 });
  };

  return (
    <div className="h-96 flex flex-col border rounded bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <p>{msg.content}</p>
              <small className="opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
        {isTyping && <p className="text-gray-500 text-sm">Typing...</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">Send</button>
      </div>
    </div>
  );
}