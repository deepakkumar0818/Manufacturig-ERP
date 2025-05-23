const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  getEnquiryByCustomId,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');

// Public route for submitting enquiries
router.route('/').post(createEnquiry);

// Protected admin routes
// Note: Add middleware for authentication and admin authorization
router.route('/').get(getEnquiries);
router.route('/custom/:customId').get(getEnquiryByCustomId);
router.route('/:id').get(getEnquiryById);
router.route('/:id').put(updateEnquiryStatus);
router.route('/:id').delete(deleteEnquiry);

module.exports = router; 