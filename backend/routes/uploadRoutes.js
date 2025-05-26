const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinaryUpload');
const { protect } = require('../middlewares/authMiddleware');
const { uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/uploadController');

// Route to upload a single image
router.post('/image', protect, upload.single('image'), uploadImage);

// Route to upload multiple images
router.post('/images', protect, upload.array('images', 10), uploadMultipleImages);

// Route to delete an image from Cloudinary
router.delete('/:publicId', protect, deleteImage);

module.exports = router; 