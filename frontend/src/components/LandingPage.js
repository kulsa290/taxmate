import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, BarChart3, FileText, Shield } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Income & Expense Tracking',
      desc: 'Track all your income and expenses in one place'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Auto Tax Calculation',
      desc: 'AI-powered tax calculations with GST included'
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      title: 'Tax Reports',
      desc: 'Generate professional tax reports instantly'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Secure & Private',
      desc: 'Bank-level security for your financial data'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      description: 'Get started with basic features',
      features: [
        '✓ Track up to 50 transactions',
        '✓ Basic tax calculation',
        '✓ Monthly reports',
        '✗ Advanced analytics',
        '✗ Priority support'
      ],
      cta: 'Sign Up Free',
      highlight: false
    },
    {
      name: 'Pro',
      price: '₹199',
      period: '/month',
      description: 'Perfect for growing businesses',
      features: [
        '✓ Unlimited transactions',
        '✓ Advanced tax planning',
        '✓ Daily reports & insights',
        '✓ Advanced analytics & forecasting',
        '✓ 24/7 Priority support'
      ],
      cta: '30 Days Free Trial',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">₹</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Karsathi</h1>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            🎉 30 Days Free Pro Trial Included
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Smart Tax Tracking for <span className="text-blue-600">Indian Businesses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop worrying about taxes. Track income, expenses, and GST automatically. Get paid faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Hero Image - Simple Dashboard Preview */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Dashboard Preview</span>
              <span className="text-xs bg-blue-500 px-3 py-1 rounded-full">Your data is safe</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/50 rounded-lg p-4">
                <p className="text-sm opacity-90">Total Income</p>
                <p className="text-3xl font-bold mt-2">₹2,45,000</p>
              </div>
              <div className="bg-blue-500/50 rounded-lg p-4">
                <p className="text-sm opacity-90">Total Expense</p>
                <p className="text-3xl font-bold mt-2">₹45,300</p>
              </div>
              <div className="bg-blue-500/50 rounded-lg p-4">
                <p className="text-sm opacity-90">Tax To Pay</p>
                <p className="text-3xl font-bold mt-2">₹27,850</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Karsathi?</h3>
          <p className="text-xl text-gray-600">Everything you need to manage taxes like a pro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
          <p className="text-xl text-gray-600">Start free. Upgrade anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-4 ring-blue-200 lg:scale-105'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.highlight && <div className="text-sm font-semibold bg-yellow-400 text-gray-900 px-3 py-1 rounded-full w-fit mb-4">Most Popular</div>}
              <h4 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h4>
              <p className={`mb-6 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`ml-2 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.period}
                </span>
              </div>

              <Link
                to="/register"
                className={`w-full block text-center py-3 rounded-lg font-semibold mb-6 transition ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-center">
                    <CheckCircle2 className={`w-5 h-5 mr-3 ${plan.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                    <span className={plan.highlight ? 'text-blue-50' : 'text-gray-700'}>
                      {feature.replace(/^✓ |^✗ /, '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-lg mb-8">Trusted by businesses across India</p>
          <div className="flex justify-center items-center space-x-8 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">₹50Cr+</p>
              <p className="text-gray-600">Transactions Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4.9★</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to simplify your taxes?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Get 30 days of Pro features free. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition font-semibold text-lg"
          >
            Start Free Trial Now <ArrowRight className="inline ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">₹</span>
                </div>
                <span className="text-white font-bold">Karsathi</span>
              </div>
              <p className="text-sm">Smart tax tracking for Indian businesses</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@karsathi.app" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Karsathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
