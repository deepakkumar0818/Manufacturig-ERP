require('dotenv').config();
const { cloudinary } = require('./config/cloudinaryConfig');

// Test function to verify Cloudinary connection by uploading a dummy file
async function testCloudinaryUpload() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '[SECRET EXISTS]' : '[SECRET MISSING]'
    });
    
    // Create a test upload using the Cloudinary Node SDK
    const options = {
      folder: 'test',
      resource_type: 'raw',
      public_id: 'test-connection-' + Date.now()
    };
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        'data:text/plain;base64,' + Buffer.from('Test connection from ERP Manufacturing app').toString('base64'),
        options,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    console.log('✅ Cloudinary connection successful!');
    console.log('Upload result URL:', result.secure_url);
    
    // Delete the test file immediately
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    
    console.log('✅ Test file deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    return false;
  }
}

// Run the test
testCloudinaryUpload()
  .then(success => {
    if (!success) {
      console.log('Please check your Cloudinary credentials in the .env file.');
    }
    process.exit(success ? 0 : 1);
  }); 