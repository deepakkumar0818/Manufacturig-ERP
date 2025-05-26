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

// Cloudinary upload stream function
const cloudinaryUpload = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_images',
        resource_type: 'auto',
        transformation: [
          { width: 500, height: 500, crop: 'limit', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = { upload, cloudinaryUpload }; 