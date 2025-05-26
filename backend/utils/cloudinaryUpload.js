const multer = require('multer');
const path = require('path');
const { cloudinary } = require('../config/cloudinaryConfig');
const { promisify } = require('util');
const streamifier = require('streamifier');

// Setup multer memory storage instead of disk storage
const storage = multer.memoryStorage();

// Define file filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Initialize multer with memory storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

/**
 * Cloudinary upload stream function
 * @param {Object} file - File object from multer
 * @param {Object} options - Upload options for Cloudinary
 * @returns {Promise} - Promise with Cloudinary upload result
 */
const cloudinaryUpload = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    // Set default options if not provided
    const uploadOptions = {
      folder: options.folder || 'profile_images',
      resource_type: options.resource_type || 'auto',
      transformation: options.transformation || [
        { width: 500, height: 500, crop: 'limit', quality: 'auto' }
      ]
    };
    
    // Add public_id if provided
    if (options.public_id) {
      uploadOptions.public_id = options.public_id;
    }
    
    // Add any other options passed in
    Object.keys(options).forEach(key => {
      if (!['folder', 'resource_type', 'transformation', 'public_id'].includes(key)) {
        uploadOptions[key] = options[key];
      }
    });

    // Stream upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} options - Delete options
 * @returns {Promise} - Promise with deletion result
 */
const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: options.resource_type || 'image',
      ...options
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = { 
  upload, 
  cloudinaryUpload,
  deleteFromCloudinary 
}; 