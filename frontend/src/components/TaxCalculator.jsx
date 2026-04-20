import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [regime, setRegime] = useState("old");

  const [deductions, setDeductions] = useState({
    section80C: "",
    section80D: "",
    hra: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setDeductions({ ...deductions, [key]: value });
  };

  const calculateTax = async () => {
    if (!income || income <= 0) {
      toast.error("Please enter a valid income");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/calculate-tax", {
        income: Number(income),
        regime,
        deductions,
      });

      setResult(res.data.data);

      // Save calculation to profile
      await axios.post("/api/profile/tax-calculation", {
        income: Number(income),
        tax: res.data.data.tax,
        regime,
      });

      toast.success("Tax calculated and saved!");
    } catch (err) {
      toast.error("Failed to calculate tax");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Smart Tax Calculator 🇮🇳</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Annual Income (₹)</label>
          <input
            type="number"
            placeholder="Enter your annual income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tax Regime</label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="old">Old Regime</option>
            <option value="new">New Regime</option>
          </select>
        </div>

        {regime === "old" && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">80C Deductions (₹)</label>
              <input
                type="number"
                placeholder="e.g., PPF, ELSS, Life Insurance"
                onChange={(e) =>
                  handleChange("section80C", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">80D Deductions (₹)</label>
              <input
                type="number"
                placeholder="Health Insurance Premium"
                onChange={(e) =>
                  handleChange("section80D", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">HRA (₹)</label>
              <input
                type="number"
                placeholder="House Rent Allowance"
                onChange={(e) =>
                  handleChange("hra", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculateTax}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate Tax"}
        </button>

        {result && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Tax Calculation Result</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Gross Income:</strong> ₹{result.income.toLocaleString()}</p>
              <p><strong>Taxable Income:</strong> ₹{result.taxableIncome.toLocaleString()}</p>
              <p><strong>Total Deductions:</strong> ₹{result.totalDeductions.toLocaleString()}</p>
              <p><strong>Tax Regime:</strong> {result.regime.toUpperCase()}</p>
              <p className="text-lg font-bold text-green-700"><strong>Tax Amount:</strong> ₹{result.tax.toLocaleString()}</p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-green-800 mb-2">💡 AI Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
