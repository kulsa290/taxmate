import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: April 2026</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Karsathi ("we", "our", "us", "Company") operates the Karsathi.app website and Karsathi application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Types of Data Collected:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Personal Data:</strong> Email address, Name, Phone Number, Address</li>
              <li><strong>Financial Data:</strong> Income, Expenses, GST information (encrypted)</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, timestamp</li>
              <li><strong>Payment Data:</strong> Processed securely via Razorpay (never stored)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Data</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Karsathi uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and maintain our Service</li>
              <li>To process your transactions</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information</li>
              <li>To monitor the usage of our Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Security of Data</h2>
            <p className="text-gray-700 leading-relaxed">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li>All financial data is encrypted using industry-standard AES-256 encryption</li>
              <li>Passwords are hashed using bcryptjs with salt rounds</li>
              <li>SSL/TLS certificates protect data in transit</li>
              <li>Regular security audits are conducted</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your account and data</li>
              <li>Right to export your data</li>
              <li>Right to opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              We use third-party services for payment processing (Razorpay) and analytics. These services have their own privacy policies and are not responsible for our privacy practices. We recommend reviewing their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> privacy@karsathi.app</p>
              <p className="text-gray-700 mt-2"><strong>Address:</strong> India</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
