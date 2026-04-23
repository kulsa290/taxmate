import React from 'react';

function ChatComposer({ inputValue, isLoading, onChange, onSubmit }) {
  const isDisabled = !inputValue.trim() || isLoading;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-border bg-white/75 px-4 py-4 backdrop-blur-xl dark:bg-slate-950/70 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-3 shadow-panel dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/70 pb-3 dark:border-slate-800">
          <button
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            type="button"
          >
            Voice input
          </button>
          <button
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            type="button"
          >
            Upload file
          </button>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Fintech-grade UI
          </span>
        </div>

        <div className="mt-3 flex items-end gap-3">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="karsathi-prompt">
              Ask anything about tax
            </label>
            <textarea
              className="max-h-40 min-h-[60px] w-full resize-none rounded-2xl border border-transparent bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-200 focus:bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-700 dark:focus:bg-slate-900"
              id="karsathi-prompt"
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about tax..."
              rows={1}
              value={inputValue}
            />
          </div>

          <button
            className={`inline-flex h-14 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition ${
              isDisabled
                ? 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                : 'bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
            }`}
            disabled={isDisabled}
            onClick={onSubmit}
            type="button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;