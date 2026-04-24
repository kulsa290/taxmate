import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TaxCalculator.css';

const TaxCalculator = () => {
  const [income, setIncome] = useState({
    salary: 0,
    hra: 0,
    otherIncome: 0,
  });

  const [deductions, setDeductions] = useState({
    rent: 0,
    section80C: 0,
    section80D: 0,
    section80E: 0,
    section80G: 0,
    otherDeductions: 0,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientName, setClientName] = useState('');

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        income,
        deductions,
        clientName: clientName || undefined,
      };

      const response = await axios.post('/api/tax/calculate', payload);

      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate tax');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [income, deductions]);

  const handleIncomeChange = (field, value) => {
    setIncome((prev) => ({
      ...prev,
      [field]: Math.max(0, parseFloat(value) || 0),
    }));
  };

  const handleDeductionChange = (field, value) => {
    setDeductions((prev) => ({
      ...prev,
      [field]: Math.max(0, parseFloat(value) || 0),
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalIncome = (income.salary || 0) + (income.hra || 0) + (income.otherIncome || 0);
  const recommendedClass = results?.comparison.recommendedRegime === 'old' ? 'recommended' : '';
  const recommendedClassNew = results?.comparison.recommendedRegime === 'new' ? 'recommended' : '';

  return (
    <div className="tax-calculator">
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>💰 Smart Income Tax Calculator</h1>
          <p>Calculate your tax under both regimes and save more</p>
        </div>

        <div className="calculator-content">
          <div className="section income-section">
            <h2 className="section-title">📊 Income Details</h2>

            <div className="form-group">
              <label>Client Name (Optional)</label>
              <input
                type="text"
                placeholder="Your name or client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">💼 Salary (Annual)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="salary"
                  type="number"
                  placeholder="0"
                  value={income.salary || ''}
                  onChange={(e) => handleIncomeChange('salary', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hra">🏠 House Rent Allowance (HRA)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="hra"
                  type="number"
                  placeholder="0"
                  value={income.hra || ''}
                  onChange={(e) => handleIncomeChange('hra', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="otherIncome">📈 Other Income</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="otherIncome"
                  type="number"
                  placeholder="0"
                  value={income.otherIncome || ''}
                  onChange={(e) => handleIncomeChange('otherIncome', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="total-income-box">
              <span>Gross Total Income:</span>
              <span className="amount">{formatCurrency(totalIncome)}</span>
            </div>
          </div>

          <div className="section deductions-section">
            <h2 className="section-title">🎯 Deductions & Exemptions</h2>

            <div className="form-group">
              <label htmlFor="rent">🏘️ House Rent (Section 10(13A))</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="rent"
                  type="number"
                  placeholder="0"
                  value={deductions.rent || ''}
                  onChange={(e) => handleDeductionChange('rent', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="section80C">📦 Section 80C (Limit: ₹1,50,000)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="section80C"
                  type="number"
                  placeholder="0"
                  value={deductions.section80C || ''}
                  onChange={(e) => handleDeductionChange('section80C', e.target.value)}
                  className="input-field"
                  min="0"
                  max="150000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="section80D">🏥 Section 80D (Limit: ₹1,00,000)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="section80D"
                  type="number"
                  placeholder="0"
                  value={deductions.section80D || ''}
                  onChange={(e) => handleDeductionChange('section80D', e.target.value)}
                  className="input-field"
                  min="0"
                  max="100000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="section80E">🎓 Section 80E (Education Loan Interest)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="section80E"
                  type="number"
                  placeholder="0"
                  value={deductions.section80E || ''}
                  onChange={(e) => handleDeductionChange('section80E', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="section80G">❤️ Section 80G (Charitable Donations)</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="section80G"
                  type="number"
                  placeholder="0"
                  value={deductions.section80G || ''}
                  onChange={(e) => handleDeductionChange('section80G', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="otherDeductions">📝 Other Deductions</label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="otherDeductions"
                  type="number"
                  placeholder="0"
                  value={deductions.otherDeductions || ''}
                  onChange={(e) => handleDeductionChange('otherDeductions', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
          </div>

          {results && (
            <div className="section results-section">
              <h2 className="section-title">📈 Tax Comparison Results</h2>

              <div className="comparison-grid">
                <div className={`regime-box ${recommendedClass}`}>
                  <h3>📋 Old Regime</h3>
                  <div className="regime-detail">
                    <span>Taxable Income:</span>
                    <span>{formatCurrency(results.oldRegime.taxableIncome)}</span>
                  </div>
                  <div className="regime-detail">
                    <span>Basic Tax:</span>
                    <span>{formatCurrency(results.oldRegime.baseTax)}</span>
                  </div>
                  <div className="regime-detail">
                    <span>Cess (4%):</span>
                    <span>{formatCurrency(results.oldRegime.cess)}</span>
                  </div>
                  <div className="tax-total">
                    {formatCurrency(results.oldRegime.totalTax)}
                  </div>
                  {results.comparison.recommendedRegime === 'old' && <div className="recommended-badge">✓ RECOMMENDED</div>}
                </div>

                <div className={`regime-box ${recommendedClassNew}`}>
                  <h3>🆕 New Regime</h3>
                  <div className="regime-detail">
                    <span>Taxable Income:</span>
                    <span>{formatCurrency(results.newRegime.taxableIncome)}</span>
                  </div>
                  <div className="regime-detail">
                    <span>Basic Tax:</span>
                    <span>{formatCurrency(results.newRegime.baseTax)}</span>
                  </div>
                  <div className="regime-detail">
                    <span>Cess (4%):</span>
                    <span>{formatCurrency(results.newRegime.cess)}</span>
                  </div>
                  <div className="tax-total">
                    {formatCurrency(results.newRegime.totalTax)}
                  </div>
                  {results.comparison.recommendedRegime === 'new' && <div className="recommended-badge">✓ RECOMMENDED</div>}
                </div>
              </div>

              <div className="savings-message benefit">
                <h4>💡 Key Insight</h4>
                <p>{results.comparison.message}</p>
              </div>

              {results.suggestions && results.suggestions.length > 0 && (
                <div className="suggestions-box">
                  <h3>✨ Tax Saving Suggestions</h3>
                  <div className="suggestions-list">
                    {results.suggestions.slice(0, 5).map((suggestion, index) => (
                      <div key={index} className="suggestion-card">
                        <h4>{suggestion.title}</h4>
                        <p>{suggestion.description}</p>
                        {typeof suggestion.taxSavings === 'number' && (
                          <div className="savings-amount">💰 Save: {formatCurrency(suggestion.taxSavings)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Calculating tax...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
