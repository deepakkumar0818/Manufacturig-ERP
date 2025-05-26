require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Set the configuration directly rather than using the config file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Checking Cloudinary environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'MISSING');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[EXISTS]' : 'MISSING');

console.log('\nChecking Cloudinary configuration:');
const config = cloudinary.config();
console.log('cloud_name:', config.cloud_name || 'MISSING');
console.log('api_key:', config.api_key || 'MISSING');
console.log('api_secret:', config.api_secret ? '[EXISTS]' : 'MISSING');

// Check the version of Cloudinary SDK
console.log('\nCloudinary SDK version:', cloudinary.PACKAGE_VERSION); 