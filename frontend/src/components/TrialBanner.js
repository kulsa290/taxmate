import React, { useState, useEffect } from 'react';
import { X, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrialBanner({ user, onClose }) {
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [trialEnded, setTrialEnded] = useState(false);

  useEffect(() => {
    if (user?.trialEndDate) {
      const today = new Date();
      const trialEnd = new Date(user.trialEndDate);
      const daysLeft = Math.ceil((trialEnd - today) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 0) {
        setTrialEnded(true);
      } else {
        setTrialDaysLeft(daysLeft);
      }
    }
  }, [user]);

  if (!user || user.plan === 'pro') {
    return null; // Don't show if user already has pro
  }

  if (trialEnded) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6" />
          <div>
            <p className="font-semibold">Trial Expired</p>
            <p className="text-sm opacity-90">Your 30-day trial has ended. Upgrade to Pro to continue.</p>
          </div>
        </div>
        <Link
          to="/upgrade"
          className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Upgrade Now
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg ${trialDaysLeft <= 7 ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center space-x-3 flex-1">
        <Clock className="w-6 h-6 flex-shrink-0" />
        <div>
          <p className="font-semibold">
            {trialDaysLeft === 1 ? '⏰ Last day of your trial!' : `🎉 ${trialDaysLeft} days of Pro features left`}
          </p>
          <p className="text-sm opacity-90">
            {trialDaysLeft === 1 
              ? 'Upgrade today to keep all Pro features.'
              : 'Upgrade anytime to unlock advanced features.'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0">
        <Link
          to="/upgrade"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition whitespace-nowrap"
        >
          Upgrade Pro
        </Link>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-500/50 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
