import { useState, useContext } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const AssistantChatbox = () => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m your AI assistant. How can I help you analyze your social media today?' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', {
        message: input,
      });

      const botMessage = { from: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { from: 'bot', text: 'Oops! Something went wrong.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-500 text-black p-3 rounded-full shadow-lg hover:shadow-cyan-500 transition-all duration-300"
      >
        <FaRobot className="text-xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`w-80 h-96 mt-4 flex flex-col justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300
          ${theme === 'dark'
            ? 'bg-white/5 border-cyan-400 text-white'
            : 'bg-white border-cyan-600 text-black'
          }`}
        >
          <div className="overflow-y-auto space-y-2 h-[80%] pr-1 scrollbar-thin scrollbar-thumb-cyan-700">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm w-fit max-w-[80%] ${
                  msg.from === 'user'
                    ? 'bg-cyan-600 text-white self-end'
                    : theme === 'dark'
                      ? 'bg-cyan-200 text-black self-start'
                      : 'bg-cyan-100 text-black self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className={`flex-1 p-2 rounded-xl border placeholder:text-cyan-300
                ${theme === 'dark'
                  ? 'bg-cyan-900/50 text-white border-cyan-400'
                  : 'bg-cyan-100 text-black border-cyan-600'
                }`}
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-cyan-500 text-black p-2 rounded-xl hover:shadow-cyan-500"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantChatbox;
