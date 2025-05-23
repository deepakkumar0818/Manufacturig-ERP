const Enquiry = require('../models/enquiryModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = asyncHandler(async (req, res) => {
  const { 
    customer,
    contactPerson,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    industry,
    product,
    quantity,
    specs,
    drawings,
    expectedDelivery,
    projectTimeline,
    budget,
    preferredMaterial,
    additionalServices,
    referenceSource,
    notes
  } = req.body;

  if (!customer || !contactPerson || !email || !phone || !product || !quantity) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Generate enquiry ID with format ENQ-001, ENQ-002, etc.
  const count = await Enquiry.countDocuments();
  const id = `ENQ-${String(count + 1).padStart(3, '0')}`;

  const enquiry = await Enquiry.create({
    id,
    customer,
    contactPerson,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    industry,
    product,
    quantity,
    specs,
    drawings,
    expectedDelivery,
    projectTimeline,
    budget,
    preferredMaterial,
    additionalServices,
    referenceSource,
    notes,
    status: 'Open',
    date: new Date()
  });

  if (enquiry) {
    res.status(201).json(enquiry);
  } else {
    res.status(400);
    throw new Error('Invalid enquiry data');
  }
});

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
  res.json(enquiries);
});

// @desc    Get enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private/Admin
const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (enquiry) {
    res.json(enquiry);
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

// @desc    Get enquiry by custom ID (ENQ-XXX)
// @route   GET /api/enquiries/custom/:customId
// @access  Private/Admin
const getEnquiryByCustomId = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findOne({ id: req.params.customId });

  if (enquiry) {
    res.json(enquiry);
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const enquiry = await Enquiry.findById(req.params.id);

  if (enquiry) {
    enquiry.status = status || enquiry.status;

    const updatedEnquiry = await enquiry.save();
    res.json(updatedEnquiry);
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (enquiry) {
    await Enquiry.deleteOne({ _id: req.params.id });
    res.json({ message: 'Enquiry removed' });
  } else {
    res.status(404);
    throw new Error('Enquiry not found');
  }
});

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  getEnquiryByCustomId,
  updateEnquiryStatus,
  deleteEnquiry,
}; 