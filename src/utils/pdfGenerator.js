const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

/**
 * PDF Report Generator for Karsathi
 * Generates professional tax calculation reports with:
 * - Income breakdown
 * - Tax calculation details
 * - Regime comparison
 * - Saving suggestions
 * - CA branding
 */

class PDFGenerator {
  constructor() {
    this.browser = null;
    this.reportsDir = path.join(__dirname, '../../reports');
    this.ensureReportsDir();
  }

  /**
   * Ensure reports directory exists
   */
  ensureReportsDir() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Initialize browser
   */
  async initBrowser() {
    if (!this.browser) {
      try {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      } catch (error) {
        logger.error('Failed to initialize Puppeteer', { error: error.message });
        throw error;
      }
    }
    return this.browser;
  }

  /**
   * Close browser
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Generate HTML for tax report
   */
  generateHTML(data) {
    const {
      clientName,
      caName,
      caLogo,
      financialYear,
      income,
      deductions,
      oldRegimeResults,
      newRegimeResults,
      recommendations,
      suggestions,
      generatedDate,
    } = data;

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount);
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tax Calculation Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            background: #f5f5f5;
          }
          .container {
            width: 210mm;
            height: 297mm;
            background: white;
            margin: 0 auto;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            width: 80px;
            height: auto;
          }
          .header-text h1 {
            color: #0066cc;
            font-size: 24px;
            margin-bottom: 5px;
          }
          .header-text p {
            color: #666;
            font-size: 12px;
          }
          .ca-info {
            text-align: right;
            font-size: 12px;
          }
          .ca-info p {
            margin: 3px 0;
            color: #666;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            background: #0066cc;
            color: white;
            padding: 12px 15px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            border-radius: 3px;
          }
          .client-info {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 3px;
            margin-bottom: 15px;
          }
          .client-info-row {
            display: flex;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .client-info-row label {
            width: 150px;
            font-weight: bold;
            color: #333;
          }
          .client-info-row value {
            flex: 1;
            color: #666;
          }
          .income-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 13px;
          }
          .income-table th {
            background: #e8e8e8;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
          }
          .income-table td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          .income-table tr:nth-child(even) {
            background: #f9f9f9;
          }
          .amount-right {
            text-align: right;
          }
          .comparison-box {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }
          .regime-box {
            flex: 1;
            border: 2px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            font-size: 13px;
          }
          .regime-box.recommended {
            border-color: #28a745;
            background: #f0fff4;
          }
          .regime-box h3 {
            color: #0066cc;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .regime-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
          }
          .regime-detail label {
            font-weight: 500;
          }
          .regime-detail value {
            text-align: right;
          }
          .tax-amount {
            font-size: 18px;
            font-weight: bold;
            color: #0066cc;
            text-align: right;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #0066cc;
          }
          .recommended-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 11px;
            margin-top: 5px;
            font-weight: bold;
          }
          .suggestions {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
          }
          .suggestion-item {
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #ffe0a6;
            font-size: 13px;
          }
          .suggestion-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .suggestion-title {
            font-weight: bold;
            color: #ff6b00;
            margin-bottom: 3px;
          }
          .suggestion-savings {
            color: #28a745;
            font-weight: bold;
            font-size: 12px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
          .disclaimer {
            background: #f0f0f0;
            padding: 12px;
            border-radius: 3px;
            font-size: 11px;
            margin-top: 20px;
            line-height: 1.5;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="header-text">
              <h1>📊 Karsathi Report</h1>
              <p>Professional Tax Calculation Analysis</p>
            </div>
            <div class="ca-info">
              ${caName ? `<p><strong>${caName}</strong></p>` : ''}
              <p>Generated: ${generatedDate}</p>
              <p>F.Y: ${financialYear}</p>
            </div>
          </div>

          <!-- Client Info -->
          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="client-info">
              <div class="client-info-row">
                <label>Client Name:</label>
                <value>${clientName || 'N/A'}</value>
              </div>
              <div class="client-info-row">
                <label>Assessment Year:</label>
                <value>AY ${financialYear}</value>
              </div>
            </div>
          </div>

          <!-- Income Breakdown -->
          <div class="section">
            <div class="section-title">Income & Deduction Breakdown</div>
            <table class="income-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th class="amount-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salary</td>
                  <td class="amount-right">${formatCurrency(income.salary || 0)}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td class="amount-right">${formatCurrency(income.hra || 0)}</td>
                </tr>
                <tr>
                  <td>Other Income</td>
                  <td class="amount-right">${formatCurrency(income.otherIncome || 0)}</td>
                </tr>
                <tr style="background: #e8e8e8; font-weight: bold;">
                  <td>Gross Total Income</td>
                  <td class="amount-right">${formatCurrency((income.salary || 0) + (income.hra || 0) + (income.otherIncome || 0))}</td>
                </tr>
              </tbody>
            </table>

            <table class="income-table">
              <thead>
                <tr>
                  <th>Deductions</th>
                  <th class="amount-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${deductions.rent > 0 ? `<tr><td>House Rent (10(13A))</td><td class="amount-right">${formatCurrency(deductions.rent)}</td></tr>` : ''}
                ${deductions.section80C > 0 ? `<tr><td>Sec 80C (LIC, PPF, etc.)</td><td class="amount-right">${formatCurrency(deductions.section80C)}</td></tr>` : ''}
                ${deductions.section80D > 0 ? `<tr><td>Sec 80D (Health Insurance)</td><td class="amount-right">${formatCurrency(deductions.section80D)}</td></tr>` : ''}
                ${deductions.section80E > 0 ? `<tr><td>Sec 80E (Education Loan)</td><td class="amount-right">${formatCurrency(deductions.section80E)}</td></tr>` : ''}
                ${deductions.section80G > 0 ? `<tr><td>Sec 80G (Donations)</td><td class="amount-right">${formatCurrency(deductions.section80G)}</td></tr>` : ''}
                ${deductions.otherDeductions > 0 ? `<tr><td>Other Deductions</td><td class="amount-right">${formatCurrency(deductions.otherDeductions)}</td></tr>` : ''}
                <tr style="background: #e8e8e8; font-weight: bold;">
                  <td>Total Deductions</td>
                  <td class="amount-right">${formatCurrency(Object.values(deductions || {}).reduce((a, b) => a + b, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Regime Comparison -->
          <div class="section">
            <div class="section-title">Regime Comparison & Recommendation</div>
            <div class="comparison-box">
              <div class="regime-box ${recommendations === 'old' ? 'recommended' : ''}">
                <h3>📋 Old Regime</h3>
                <div class="regime-detail">
                  <label>Taxable Income:</label>
                  <value>${formatCurrency(oldRegimeResults.taxableIncome)}</value>
                </div>
                <div class="regime-detail">
                  <label>Basic Tax:</label>
                  <value>${formatCurrency(oldRegimeResults.baseTax)}</value>
                </div>
                <div class="regime-detail">
                  <label>Cess (4%):</label>
                  <value>${formatCurrency(oldRegimeResults.cess)}</value>
                </div>
                <div class="regime-detail">
                  <label>Surcharge:</label>
                  <value>${formatCurrency(oldRegimeResults.surcharge)}</value>
                </div>
                <div class="tax-amount">
                  ${formatCurrency(oldRegimeResults.totalTax)}
                </div>
                ${recommendations === 'old' ? '<div class="recommended-badge">✓ RECOMMENDED</div>' : ''}
              </div>

              <div class="regime-box ${recommendations === 'new' ? 'recommended' : ''}">
                <h3>🆕 New Regime</h3>
                <div class="regime-detail">
                  <label>Standard Deduction:</label>
                  <value>${formatCurrency(newRegimeResults.standardDeduction)}</value>
                </div>
                <div class="regime-detail">
                  <label>Taxable Income:</label>
                  <value>${formatCurrency(newRegimeResults.taxableIncome)}</value>
                </div>
                <div class="regime-detail">
                  <label>Basic Tax:</label>
                  <value>${formatCurrency(newRegimeResults.baseTax)}</value>
                </div>
                <div class="regime-detail">
                  <label>Cess (4%):</label>
                  <value>${formatCurrency(newRegimeResults.cess)}</value>
                </div>
                <div class="regime-detail">
                  <label>Surcharge:</label>
                  <value>${formatCurrency(newRegimeResults.surcharge)}</value>
                </div>
                <div class="tax-amount">
                  ${formatCurrency(newRegimeResults.totalTax)}
                </div>
                ${recommendations === 'new' ? '<div class="recommended-badge">✓ RECOMMENDED</div>' : ''}
              </div>
            </div>
          </div>

          <!-- Tax Saving Suggestions -->
          ${
            suggestions && suggestions.length > 0
              ? `
            <div class="section">
              <div class="section-title">💡 Tax Saving Suggestions</div>
              <div class="suggestions">
                ${suggestions
                  .slice(0, 5)
                  .map(
                    (suggestion) => `
                  <div class="suggestion-item">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div>${suggestion.description}</div>
                    ${
                      typeof suggestion.taxSavings === 'number'
                        ? `<div class="suggestion-savings">💰 Potential Tax Savings: ${formatCurrency(suggestion.taxSavings)}</div>`
                        : ''
                    }
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          <!-- Disclaimer -->
          <div class="disclaimer">
            <strong>Disclaimer:</strong> This report is generated for indicative purposes only and should not be construed as professional tax advice. Please consult with a qualified Chartered Accountant or tax professional for personalized guidance. Tax laws are subject to change, and this calculation is based on FY 2024-25 rates.
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Generated by Karsathi | www.karsathi.in | ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate PDF from tax calculation data
   */
  async generatePDF(data, outputPath) {
    try {
      await this.initBrowser();
      const page = await this.browser.newPage();

      const html = this.generateHTML(data);
      await page.setContent(html);

      // Set PDF options
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
        printBackground: true,
        preferCSSPageSize: true,
      });

      await page.close();
      logger.info('PDF generated successfully', { outputPath });
      return outputPath;
    } catch (error) {
      logger.error('Error generating PDF', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate PDF with unique filename
   */
  async generateAndSaveReport(data) {
    try {
      const timestamp = Date.now();
      const filename = `tax-report-${data.clientName ? data.clientName.replace(/\s+/g, '-') : 'report'}-${timestamp}.pdf`;
      const outputPath = path.join(this.reportsDir, filename);

      await this.generatePDF(data, outputPath);

      return {
        success: true,
        filename,
        path: outputPath,
        url: `/reports/${filename}`,
      };
    } catch (error) {
      logger.error('Failed to generate and save report', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new PDFGenerator();
