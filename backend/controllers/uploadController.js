const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinaryConfig');
const { cloudinaryUpload } = require('../utils/cloudinaryUpload');

/**
 * @desc    Upload single image to Cloudinary
 * @route   POST /api/uploads/image
 * @access  Private
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  try {
    // Get folder from query params or use default
    const folder = req.query.folder || 'uploads';
    
    // Define custom upload options
    const options = {
      folder: folder,
      resource_type: 'auto',
      // Apply transformation based on size parameter
      transformation: req.query.size === 'thumbnail' 
        ? [{ width: 200, height: 200, crop: 'fill', quality: 'auto' }]
        : req.query.size === 'medium'
        ? [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
        : req.query.size === 'large'
        ? [{ width: 1024, height: 1024, crop: 'limit', quality: 'auto' }]
        : [{ quality: 'auto' }]
    };

    // Upload to Cloudinary with custom options
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(201).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500);
    throw new Error('Image upload failed: ' + error.message);
  }
});

/**
 * @desc    Upload multiple images to Cloudinary
 * @route   POST /api/uploads/images
 * @access  Private
 */
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No image files provided');
  }

  try {
    // Get folder from query params or use default
    const folder = req.query.folder || 'uploads';
    
    // Upload all files
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
            transformation: [{ quality: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    // Format the response
    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }));

    res.status(201).json({
      success: true,
      count: uploadedImages.length,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    res.status(500);
    throw new Error('Images upload failed: ' + error.message);
  }
});

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/uploads/:publicId
 * @access  Private
 */
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  
  if (!publicId) {
    res.status(400);
    throw new Error('Public ID is required');
  }

  try {
    // Determine resource type from query or default to image
    const resourceType = req.query.resourceType || 'image';
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok' || result.result === 'not found') {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(400);
      throw new Error(`Failed to delete file: ${result.result}`);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    res.status(500);
    throw new Error('Delete operation failed: ' + error.message);
  }
});

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage
}; 