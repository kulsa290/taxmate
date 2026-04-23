const Client = require('../models/client');
const AppError = require('../utils/appError');

/**
 * Create a new client - POST /api/clients
 */
exports.createClient = async (req, res, next) => {
  try {
    const { clientName, email, phone, panNumber, aadharNumber, businessType, notes } =
      req.body;

    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!clientName || !email) {
      return next(new AppError('Client name and email are required', 400));
    }

    // Check if client already exists
    const existingClient = await Client.findOne({
      userId: req.userId,
      email: email.toLowerCase(),
    });

    if (existingClient) {
      return next(new AppError('Client with this email already exists', 400));
    }

    const client = new Client({
      userId: req.userId,
      clientName,
      email,
      phone,
      panNumber,
      aadharNumber,
      businessType,
      notes,
    });

    await client.save();

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all clients for logged-in user - GET /api/clients
 */
exports.getAllClients = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const { status = 'active', search } = req.query;

    // Build filter
    const filter = { userId: req.userId };
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { panNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .select('-calculations'); // Exclude calculations for list view

    return res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single client - GET /api/clients/:id
 */
exports.getClient = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate('calculations', 'taxResults createdAt clientName');

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update client - PUT /api/clients/:id
 */
exports.updateClient = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const allowedFields = [
      'clientName',
      'email',
      'phone',
      'panNumber',
      'aadharNumber',
      'dateOfBirth',
      'businessType',
      'estimatedIncome',
      'notes',
      'address',
      'status',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete client - DELETE /api/clients/:id
 */
exports.deleteClient = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add calculation to client - POST /api/clients/:id/calculations
 */
exports.addCalculationToClient = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const { calculationId } = req.body;

    if (!calculationId) {
      return next(new AppError('Calculation ID is required', 400));
    }

    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    // Avoid duplicates
    if (!client.calculations.includes(calculationId)) {
      client.calculations.push(calculationId);
      await client.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Calculation added to client',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};
