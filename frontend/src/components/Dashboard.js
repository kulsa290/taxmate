import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import axios from 'axios';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

export default function Dashboard() {
  const [taxHistory, setTaxHistory] = useState([]);
  const [chatStats, setChatStats] = useState({ totalChats: 0, recentChats: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [taxRes, chatRes] = await Promise.all([
        axios.get('/api/profile/tax-history'),
        axios.get('/api/chat/history?limit=5')
      ]);

      setTaxHistory(taxRes.data.data.taxCalculations);
      setChatStats({
        totalChats: chatRes.data.data.total,
        recentChats: chatRes.data.data.chats
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    }
  };

  const taxChartData = {
    labels: taxHistory.map(calc => new Date(calc.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Tax Amount',
        data: taxHistory.map(calc => calc.tax),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const incomeChartData = {
    labels: taxHistory.map(calc => new Date(calc.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Income',
        data: taxHistory.map(calc => calc.income),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Tax Calculations</h3>
          <p className="text-3xl font-bold text-blue-600">{taxHistory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Chats</h3>
          <p className="text-3xl font-bold text-green-600">{chatStats.totalChats}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Average Tax</h3>
          <p className="text-3xl font-bold text-purple-600">
            ₹{taxHistory.length > 0 ? Math.round(taxHistory.reduce((sum, calc) => sum + calc.tax, 0) / taxHistory.length) : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Latest Regime</h3>
          <p className="text-3xl font-bold text-orange-600">
            {taxHistory.length > 0 ? taxHistory[taxHistory.length - 1].regime.toUpperCase() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tax Amount Over Time</h2>
          {taxHistory.length > 0 ? (
            <Bar data={taxChartData} />
          ) : (
            <p className="text-gray-500">No tax calculations yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Income Trend</h2>
          {taxHistory.length > 0 ? (
            <Line data={incomeChartData} />
          ) : (
            <p className="text-gray-500">No tax calculations yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent AI Chats</h2>
        {chatStats.recentChats.length > 0 ? (
          <div className="space-y-4">
            {chatStats.recentChats.map((chat) => (
              <div key={chat.id} className="border-b pb-2">
                <p className="font-medium">{chat.question}</p>
                <p className="text-sm text-gray-600">{chat.answer.substring(0, 100)}...</p>
                <p className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No chats yet.</p>
        )}
      </div>
    </div>
  );
}