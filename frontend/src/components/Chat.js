import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatPanel from './ChatPanel';
import ChatComposer from './ChatComposer';
import toast from 'react-hot-toast';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get('/api/chat/history');
      const chatMessages = res.data.data.chats.map(chat => [
        { id: `${chat.id}-q`, role: 'user', text: chat.question, animate: false },
        { id: `${chat.id}-a`, role: 'assistant', text: chat.answer, animate: false }
      ]).flat();
      setMessages(chatMessages);
    } catch (err) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      animate: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: inputValue });
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.data.data.reply,
        animate: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1)); // Remove the user message if failed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatPanel
        isLoading={isLoading}
        messages={messages}
        title="Tax Consultation"
      />
      <ChatComposer
        inputValue={inputValue}
        isLoading={isLoading}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </div>
  );
}