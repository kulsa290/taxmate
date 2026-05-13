import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Debug environment variables on component mount
  useEffect(() => {
    console.log('🔧 Environment check:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_APP_URL: process.env.REACT_APP_APP_URL,
      NODE_ENV: process.env.NODE_ENV
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Check for uppercase, lowercase, and numbers
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter');
      return;
    }

    if (!/\d/.test(password)) {
      toast.error('Password must contain at least one number');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting registration process...');
      await register(name, email, password, role);

      console.log('✅ Registration completed successfully');
      toast.success('Welcome to Karsathi! Registration successful.');

      // Small delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('❌ Registration error:', err);

      // Better error handling
      let errorMessage = 'Registration failed. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists';
      } else if (err.response?.status === 400) {
        errorMessage = 'Please check your input and try again';
      } else if (err.response?.status === 429) {
        errorMessage = 'Too many attempts. Please wait a moment.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection.';
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register for Karsathi</h2>

        {/* Debug info - remove in production */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Check console for API logs
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <span className="block text-gray-700 mb-2">Register as</span>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="ca"
                  checked={role === 'ca'}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                />
                CA
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={role === 'client'}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                />
                Client
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choose CA if you are a tax professional, or Client for standard users.
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              minLength={8}
              placeholder="Min 8 chars, uppercase, lowercase, number"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain uppercase, lowercase letters and numbers
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}