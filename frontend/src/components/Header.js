import React from 'react';

function Header({ onOpenSidebar }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white lg:hidden dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={onOpenSidebar}
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
          <span aria-hidden="true" className="text-lg">
            ☰
          </span>
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
            Premium Tax Copilot
          </p>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-slate-50">
            TaxMate AI Assistant
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:block dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
          AI online
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200"
          type="button"
        >
          TM
        </button>
      </div>
    </header>
  );
}

export default Header;