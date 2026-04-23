import React, { useEffect, useState } from 'react';

function ChatMessage({ message }) {
  const isUserMessage = message.role === 'user';
  const [visibleText, setVisibleText] = useState(message.animate ? '' : message.text);

  useEffect(() => {
    if (!message.animate) {
      setVisibleText(message.text);
      return undefined;
    }

    let currentIndex = 0;
    const step = Math.max(1, Math.ceil(message.text.length / 48));
    const typingTimer = window.setInterval(() => {
      currentIndex += step;
      setVisibleText(message.text.slice(0, currentIndex));

      if (currentIndex >= message.text.length) {
        window.clearInterval(typingTimer);
      }
    }, 18);

    return () => window.clearInterval(typingTimer);
  }, [message.animate, message.text]);

  return (
    <div className={`message-enter flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUserMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUserMessage
              ? 'rounded-br-md bg-slate-950 text-white shadow-slate-950/10 dark:bg-white dark:text-slate-950'
              : 'rounded-bl-md border border-slate-200/70 bg-white/90 text-slate-700 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-7 sm:text-[15px]">{visibleText}</p>
        </div>

        <p className="mt-2 px-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
          {isUserMessage ? 'You' : 'Karsathi'}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;