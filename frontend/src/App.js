import React, { useEffect, useState } from 'react';
import ChatComposer from './components/ChatComposer';
import ChatPanel from './components/ChatPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

const CHAT_STORAGE_KEY = 'taxmate-conversations';
const THEME_STORAGE_KEY = 'taxmate-theme';

const createId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createMessage = (role, text, options = {}) => ({
  id: createId(),
  role,
  text,
  animate: Boolean(options.animate),
  createdAt: options.createdAt || new Date().toISOString(),
});

const createConversation = (title = 'New Chat') => ({
  id: createId(),
  title,
  createdAt: new Date().toISOString(),
  messages: [
    createMessage(
      'assistant',
      'Namaste. I am TaxMate AI, your Indian tax assistant for GST, income tax, TDS, and compliance. Ask a question to get a practical answer in plain English or Hinglish.'
    ),
  ],
});

const getConversationTitle = (message) => {
  const trimmed = message.trim().replace(/\s+/g, ' ');

  if (!trimmed) {
    return 'New Chat';
  }

  return trimmed.length > 36 ? `${trimmed.slice(0, 36)}...` : trimmed;
};

const getStoredToken = () => {
  const possibleKeys = ['token', 'authToken', 'taxmateToken', 'jwtToken'];

  for (const key of possibleKeys) {
    const value = window.localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return '';
};

function App() {
  const [conversations, setConversations] = useState(() => {
    const storedConversations = window.localStorage.getItem(CHAT_STORAGE_KEY);

    if (storedConversations) {
      try {
        const parsed = JSON.parse(storedConversations);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        window.localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }

    return [createConversation('GST Help Desk')];
  });
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const storedConversations = window.localStorage.getItem(CHAT_STORAGE_KEY);

    if (storedConversations) {
      try {
        const parsed = JSON.parse(storedConversations);

        if (Array.isArray(parsed) && parsed[0]?.id) {
          return parsed[0].id;
        }
      } catch (error) {
        return '';
      }
    }

    return '';
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => window.localStorage.getItem(THEME_STORAGE_KEY) || 'light');

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (!activeConversationId && conversations[0]?.id) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const createNewChat = () => {
    const nextConversation = createConversation();

    setConversations((currentConversations) => [nextConversation, ...currentConversations]);
    setActiveConversationId(nextConversation.id);
    setInputValue('');
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setSidebarOpen(false);
  };

  const appendMessageToConversation = (conversationId, message) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const nextTitle =
          conversation.messages.length <= 1 && message.role === 'user'
            ? getConversationTitle(message.text)
            : conversation.title;

        return {
          ...conversation,
          title: nextTitle,
          messages: [...conversation.messages, message],
        };
      })
    );
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading || !activeConversation) {
      return;
    }

    const conversationId = activeConversation.id;
    const userMessage = createMessage('user', trimmedInput);

    appendMessageToConversation(conversationId, userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const authToken = getStoredToken();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error?.message ||
          (response.status === 401
            ? 'Please sign in first so TaxMate can access your protected chat assistant.'
            : 'TaxMate could not process that question right now.');

        throw new Error(errorMessage);
      }

      appendMessageToConversation(
        conversationId,
        createMessage('assistant', data?.data?.reply || data?.reply || 'I need a little more detail to help.', {
          animate: true,
        })
      );
    } catch (error) {
      appendMessageToConversation(
        conversationId,
        createMessage(
          'assistant',
          error.message || 'Something went wrong while contacting the server. Please try again in a moment.',
          { animate: true }
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-shell-gradient text-ink transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(71,85,105,0.32),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.6),_transparent_30%),linear-gradient(180deg,_#020617,_#0f172a)]">
      <Sidebar
        activeConversationId={activeConversation?.id}
        conversations={conversations}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={createNewChat}
        onSelectConversation={handleSelectConversation}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
        theme={theme}
      />

      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col lg:pl-3">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 via-white/10 to-transparent dark:from-slate-900/50 dark:via-slate-900/10" />

        <div className="relative flex min-h-screen flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 lg:px-6 lg:py-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-border bg-panel shadow-soft backdrop-blur-xl dark:bg-slate-900/75">
            <Header onOpenSidebar={() => setSidebarOpen(true)} />

            <ChatPanel
              isLoading={isLoading}
              messages={activeConversation?.messages || []}
              title={activeConversation?.title || 'New Chat'}
            />

            <ChatComposer
              inputValue={inputValue}
              isLoading={isLoading}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
