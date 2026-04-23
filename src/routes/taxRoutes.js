const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Tax Calculation Routes
 */

// Calculate tax (works for both authenticated and unauthenticated users)
// Unauthenticated users get real-time calculation only
// Authenticated users get calculation saved to their history
router.post('/calculate', authMiddleware.optional, taxController.calculateTax);

// Get user's calculation history (requires authentication)
router.get('/history', authMiddleware.required, taxController.getCalculationHistory);

// Get specific calculation (requires authentication)
router.get('/:id', authMiddleware.required, taxController.getCalculation);

// Delete calculation (requires authentication)
router.delete('/:id', authMiddleware.required, taxController.deleteCalculation);

module.exports = router;
