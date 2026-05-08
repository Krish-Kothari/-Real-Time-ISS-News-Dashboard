import React, { useState, useEffect, useRef } from 'react';
import { useChatStore, useISSStore, useNewsStore } from '../../utils/store.js';
import aiApi from '../../utils/aiApi.js';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';

export const Chatbot = () => {
  const { messages, isOpen, isLoading, addMessage, setIsOpen, setIsLoading, clearMessages, loadMessages } = useChatStore();
  const { location, speed, lastPositions, totalPeople, currentLocationName } = useISSStore();
  const { articles } = useNewsStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build context from dashboard data
  const buildContext = () => {
    const issInfo = `
Current ISS Information:
- Location: ${currentLocationName}
- Latitude: ${location.latitude.toFixed(4)}
- Longitude: ${location.longitude.toFixed(4)}
- Speed: ${speed} km/h
- Positions Tracked: ${lastPositions.length}
- People in Space: ${totalPeople}
`;

    const newsInfo = `
News Articles (${articles.length} available):
${articles.slice(0, 5).map((a) => `- ${a.title} (Source: ${a.source.name})`).join('\n')}
`;

    return `You are a helpful assistant that answers questions ONLY based on dashboard data provided below. Do not provide information outside this data. Be concise.\n${issInfo}\n${newsInfo}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue, timestamp: new Date() };
    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = buildContext();
      const response = await aiApi.generateResponse(inputValue, context);

      const aiMessage = { role: 'assistant', content: response, timestamp: new Date() };
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 pulse-glow"
        title="Open Chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col z-50 max-h-[600px]">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Dashboard Assistant</h3>
        <div className="flex gap-2">
          <button
            onClick={clearMessages}
            title="Clear chat"
            className="hover:bg-blue-700 p-1 rounded"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            title="Close chat"
            className="hover:bg-blue-700 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>Hello! I can answer questions about:</p>
            <ul className="mt-2 text-xs">
              <li>ISS location and speed</li>
              <li>People in space</li>
              <li>Latest news articles</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce" style={{ delay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce" style={{ delay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-300 dark:border-slate-600 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about ISS or news..."
            disabled={isLoading}
            className="input flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="btn btn-primary text-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
