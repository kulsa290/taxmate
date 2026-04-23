import React, { useState } from 'react';
import { X, CheckCircle2, Zap, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UpgradeModal({ isOpen, onClose, user }) {
  const [loading, setLoading] = useState(false);

  const proFeatures = [
    'Unlimited transactions',
    'Advanced tax planning',
    'Daily reports & insights',
    'Advanced analytics',
    '24/7 Priority support',
    'API access'
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Create Razorpay order
      const response = await axios.post('/api/payments/create-order', {
        plan: 'pro',
        amount: 19900 // ₹199 in paise
      });

      const { orderId } = response.data.data;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: 19900,
        currency: 'INR',
        order_id: orderId,
        name: 'Karsathi',
        description: 'Pro Plan',
        handler: async (paymentResponse) => {
          try {
            // Verify payment
            await axios.post('/api/payments/verify', {
              orderId,
              paymentId: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature
            });

            toast.success('Upgrade successful! 🎉');
            onClose();
            window.location.reload();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Failed to create order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current User */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="font-semibold text-gray-900">{user?.email}</p>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-900">₹199</span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-sm text-gray-600">Cancel anytime. No questions asked.</p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">What you'll get:</p>
          {proFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>Secure payments powered by Razorpay</span>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Start Upgrade'}
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Maybe Later
          </button>
        </div>

        {/* FAQ */}
        <details className="text-sm">
          <summary className="font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
            Have questions?
          </summary>
          <div className="mt-3 space-y-2 text-gray-600">
            <p><strong>Can I cancel?</strong> Yes, anytime. No penalties.</p>
            <p><strong>What's included?</strong> See the features above.</p>
            <p><strong>Need help?</strong> Email support@karsathi.app</p>
          </div>
        </details>
      </div>
    </div>
  );
}
