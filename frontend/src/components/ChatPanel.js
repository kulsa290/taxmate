import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

function TypingIndicator() {
  return (
    <div className="message-enter flex justify-start">
      <div>
        <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200/70 bg-white/90 px-4 py-3 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        </div>

        <p className="mt-2 px-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
          TaxMate is thinking
        </p>
      </div>
    </div>
  );
}

function ChatPanel({ isLoading, messages, title }) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isLoading, messages]);

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-transparent via-white/20 to-white/40 px-4 py-5 dark:via-slate-900/15 dark:to-slate-900/35 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200/70 bg-white/65 px-5 py-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/45 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
            Active conversation
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
        </div>

        <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400">
          <p>Ask about income tax, GST filings, TDS, deductions, or compliance notices.</p>
          <p>Future-ready for voice prompts, uploads, and smart document summaries.</p>
        </div>
      </div>

      <div className="chat-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading ? <TypingIndicator /> : null}
        <div ref={endOfMessagesRef} />
      </div>
    </main>
  );
}

export default ChatPanel;