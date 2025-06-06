const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinaryConfig');
const { cloudinaryUpload, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, company, phone, position } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    company: company || '',
    phone: phone || '',
    position: position || '',
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      position: user.position,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Make sure we're returning the latest user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      position: user.position,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      position: user.position,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Handle email update separately to check for duplicates
    if (req.body.email && req.body.email !== user.email) {
      // Check if email already exists for another user
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use by another account');
      }
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company = req.body.company || user.company;
    user.phone = req.body.phone || user.phone;
    user.position = req.body.position || user.position;
    
    // Handle profileImage upload via Cloudinary
    if (req.file) {
      try {
        // If user already has a Cloudinary profile image, delete it
        if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
          // Extract public_id from Cloudinary URL
          // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/profile_images/abcdef123456
          const publicId = user.profileImage.split('/').slice(-2).join('/').split('.')[0];
          if (publicId.startsWith('profile_images/')) {
            // Delete the image from Cloudinary if it's in our folder
            await deleteFromCloudinary(publicId);
          }
        }
        
        // Upload new image to Cloudinary with options
        const uploadOptions = {
          folder: 'profile_images',
          public_id: `user_${user._id}_${Date.now()}`, // Use unique ID to avoid cache issues
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face', quality: 'auto' }
          ]
        };
        
        const result = await cloudinaryUpload(req.file, uploadOptions);
        user.profileImage = result.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500);
        throw new Error('Image upload failed');
      }
    } else if (req.body.profileImage) {
      // Allow setting a URL for the profile image
      user.profileImage = req.body.profileImage;
    }
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    console.log("User profile updated with image:", updatedUser.profileImage);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      company: updatedUser.company,
      phone: updatedUser.phone,
      position: updatedUser.position,
      profileImage: updatedUser.profileImage,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
}; 