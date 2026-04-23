import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-gray-600 mt-2">Last updated: April 2026</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the Karsathi website and application ("Service"), you accept and agree to be bound by and comply with these Terms and Conditions. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Karsathi's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on Karsathi website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on Karsathi's website are provided on an 'as is' basis. Karsathi makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Karsathi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Karsathi's website, even if Karsathi or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials appearing on Karsathi's website could include technical, typographical, or photographic errors. Karsathi does not warrant that any of the materials on its website are accurate, complete, or current. Karsathi may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Maintaining the confidentiality of your password and account information</li>
              <li>Accepting responsibility for all activities that occur under your account</li>
              <li>Ensuring all information you provide is accurate and truthful</li>
              <li>Using the Service only for lawful purposes</li>
              <li>Not violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Financial Information</h2>
            <p className="text-gray-700 leading-relaxed">
              The information provided by Karsathi is for informational purposes only and should not be considered as financial or tax advice. You should consult with a qualified tax professional or accountant for specific guidance. Karsathi is not liable for any financial decisions made based on information provided through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Subscription Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Pro Plan:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Monthly subscription at ₹199</li>
              <li>Auto-renewal on each billing cycle</li>
              <li>Cancel anytime from your account settings</li>
              <li>No refunds for partial months</li>
              <li>Trial period of 30 days is free</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              All materials on Karsathi's website, including but not limited to text, graphics, logos, images, and software, are the property of Karsathi or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no case shall Karsathi, its directors, officers, employees, or agents be liable for any indirect, incidental, special, consequential or punitive damages, regardless of the cause or the theory of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Revisions and Errata</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials appearing on Karsathi's website may contain errors or may not be complete or current. Karsathi does not commit to updating such materials and may make changes at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Karsathi has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Karsathi of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              Karsathi may revise these Terms and Conditions at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms and Conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions and any separate agreements we may have with you relating to Karsathi's website are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> support@karsathi.app</p>
              <p className="text-gray-700 mt-2"><strong>Website:</strong> karsathi.app</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
