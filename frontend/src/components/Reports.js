import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Reports.css';

/**
 * Reports Component
 * View, download, and share tax calculation reports
 */
const Reports = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [caInfo, setCAInfo] = useState({
    name: '',
    logo: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  /**
   * Fetch calculation history on mount
   */
  useEffect(() => {
    fetchCalculations();
  }, []);

  /**
   * Fetch user's calculation history
   */
  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tax/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setCalculations(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load calculations');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate PDF report
   */
  const handleGeneratePDF = async () => {
    if (!selectedCalculation) return;

    try {
      setGeneratingPDF(true);

      const response = await axios.post(
        '/api/tax/pdf',
        {
          calculationId: selectedCalculation._id,
          caName: caInfo.name,
          caLogo: caInfo.logo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('PDF generated successfully');
        // Download the PDF
        const link = document.createElement('a');
        link.href = response.data.data.downloadUrl;
        link.download = response.data.data.filename;
        link.click();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  /**
   * Share via WhatsApp
   */
  const handleShareWhatsApp = () => {
    if (!selectedCalculation) return;

    const message = `📊 Karsathi Report\n\nClient: ${selectedCalculation.clientName || 'Tax Calculation'}\nOld Regime Tax: ₹${selectedCalculation.taxResults.oldRegimeTax.toLocaleString()}\nNew Regime Tax: ₹${selectedCalculation.taxResults.newRegimeTax.toLocaleString()}\nSavings: ₹${selectedCalculation.taxResults.taxSavings.toLocaleString()}\n\nRecommended: ${selectedCalculation.taxResults.recommendedRegime.toUpperCase()}`;

    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    setSuccess('Opened WhatsApp');
  };

  /**
   * Clear messages after 3 seconds
   */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <h1>📄 Tax Reports</h1>
        <p>View, download, and share your tax calculation reports</p>
      </div>

      {/* Messages */}
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <div className="reports-layout">
        {/* Left: Calculations List */}
        <div className="calculations-list-panel">
          <h2>Your Calculations</h2>

          {loading ? (
            <div className="loading">Loading calculations...</div>
          ) : calculations.length === 0 ? (
            <div className="empty-state">
              <p>No calculations found</p>
              <p className="help-text">Start by calculating your tax in the Calculator</p>
            </div>
          ) : (
            <div className="calculations-list">
              {calculations.map((calc) => (
                <div
                  key={calc._id}
                  className={`calc-item ${
                    selectedCalculation?._id === calc._id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCalculation(calc)}
                >
                  <div className="calc-item-header">
                    <h4>{calc.clientName || 'Tax Calculation'}</h4>
                    <span className="calc-date">{formatDate(calc.createdAt)}</span>
                  </div>
                  <div className="calc-item-details">
                    <span className="tax-badge">
                      💰 {formatCurrency(calc.taxResults.oldRegimeTax)}
                    </span>
                    <span className={`regime-badge ${calc.taxResults.recommendedRegime}`}>
                      {calc.taxResults.recommendedRegime.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Report Details & Actions */}
        <div className="report-details-panel">
          {!selectedCalculation ? (
            <div className="empty-selection">
              <p>👈 Select a calculation from the list to view details</p>
            </div>
          ) : (
            <>
              {/* CA Branding Section */}
              <div className="ca-branding-section">
                <h3>📋 CA Branding (Optional)</h3>
                <div className="form-group">
                  <label>CA Name</label>
                  <input
                    type="text"
                    value={caInfo.name}
                    onChange={(e) => setCAInfo({ ...caInfo, name: e.target.value })}
                    placeholder="Your Chartered Accountant name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>CA Logo URL</label>
                  <input
                    type="text"
                    value={caInfo.logo}
                    onChange={(e) => setCAInfo({ ...caInfo, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="calculation-summary">
                <h3>📊 Calculation Summary</h3>

                <div className="summary-item">
                  <span className="label">Client Name:</span>
                  <span className="value">
                    {selectedCalculation.clientName || 'N/A'}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(selectedCalculation.createdAt)}</span>
                </div>

                <div className="summary-item">
                  <span className="label">Gross Income:</span>
                  <span className="value">{formatCurrency(
                    (selectedCalculation.income?.salary || 0) +
                    (selectedCalculation.income?.hra || 0) +
                    (selectedCalculation.income?.otherIncome || 0)
                  )}</span>
                </div>
              </div>

              {/* Tax Comparison */}
              <div className="tax-comparison">
                <h3>💹 Tax Comparison</h3>

                <div className="regime-card old-regime">
                  <h4>📋 Old Regime</h4>
                  <div className="tax-amount">
                    {formatCurrency(selectedCalculation.taxResults.oldRegimeTax)}
                  </div>
                </div>

                <div className="regime-card new-regime">
                  <h4>🆕 New Regime</h4>
                  <div className="tax-amount">
                    {formatCurrency(selectedCalculation.taxResults.newRegimeTax)}
                  </div>
                </div>

                <div className="savings-info">
                  <h4>💡 Tax Savings</h4>
                  <div className="savings-amount">
                    ₹{selectedCalculation.taxResults.taxSavings.toLocaleString()}
                  </div>
                  <p>By choosing {selectedCalculation.taxResults.recommendedRegime} Regime</p>
                </div>
              </div>

              {/* Suggestions */}
              {selectedCalculation.suggestions && selectedCalculation.suggestions.length > 0 && (
                <div className="suggestions-preview">
                  <h3>✨ Top Suggestions</h3>
                  <div className="suggestions-list">
                    {selectedCalculation.suggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <h5>{suggestion.title}</h5>
                        <p>{suggestion.description}</p>
                        {typeof suggestion.taxSavings === 'number' && (
                          <span className="savings">
                            💰 Save: {formatCurrency(suggestion.taxSavings)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={handleGeneratePDF}
                  disabled={generatingPDF}
                  className="btn btn-primary btn-large"
                >
                  {generatingPDF ? '📄 Generating PDF...' : '📥 Download PDF Report'}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="btn btn-secondary btn-large"
                >
                  📱 Share via WhatsApp
                </button>

                <button className="btn btn-secondary btn-large">
                  📧 Send via Email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
