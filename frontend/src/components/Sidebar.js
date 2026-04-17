import React from 'react';

function Sidebar({
  activeConversationId,
  conversations,
  isOpen,
  onClose,
  onNewChat,
  onSelectConversation,
  onToggleTheme,
  theme,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[292px] flex-col border-r border-border bg-white/85 p-4 shadow-panel backdrop-blur-xl transition-transform duration-300 dark:bg-slate-950/80 lg:static lg:z-auto lg:w-[320px] lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
              AI Workspace
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              💼 TaxMate
            </h2>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-white lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            onClick={onClose}
            type="button"
          >
            <span className="sr-only">Close sidebar</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <button
          className="group inline-flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          onClick={onNewChat}
          type="button"
        >
          <span>New Chat</span>
          <span aria-hidden="true" className="text-lg transition group-hover:translate-x-0.5">
            +
          </span>
        </button>

        <div className="mt-6 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Theme
            </p>
            <button
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              onClick={onToggleTheme}
              type="button"
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Structured for theme toggles, richer chat filters, and pinned conversations.
          </p>
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/70 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Recent chats
            </p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {conversations.length}
            </span>
          </div>

          <div className="chat-scrollbar h-full overflow-y-auto px-2 py-2">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  className={`mb-2 w-full rounded-2xl px-3 py-3 text-left transition ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-slate-100 dark:text-slate-950'
                      : 'bg-transparent text-slate-600 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`}
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  type="button"
                >
                  <p className="truncate text-sm font-semibold">{conversation.title}</p>
                  <p
                    className={`mt-1 text-xs ${
                      isActive ? 'text-white/70 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {new Date(conversation.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;