const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Client Management Routes
 * All routes require authentication
 */

// Create client
router.post('/', authMiddleware.required, clientController.createClient);

// Get all clients (with search & filter)
router.get('/', authMiddleware.required, clientController.getAllClients);

// Get specific client with calculations
router.get('/:id', authMiddleware.required, clientController.getClient);

// Update client
router.put('/:id', authMiddleware.required, clientController.updateClient);

// Delete client
router.delete('/:id', authMiddleware.required, clientController.deleteClient);

// Add calculation to client
router.post('/:id/calculations', authMiddleware.required, clientController.addCalculationToClient);

module.exports = router;
