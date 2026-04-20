import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/chat', label: 'AI Chat', icon: '💬' },
    { path: '/tax-calculator', label: 'Tax Calculator', icon: '🧮' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

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

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              onClick={onClose}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;