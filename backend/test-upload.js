require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('./config/cloudinaryConfig');

// Function to test simple direct upload to Cloudinary
async function testDirectUpload() {
  try {
    console.log('Testing direct upload to Cloudinary...');
    console.log('Cloudinary Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '[SECRET EXISTS]' : '[SECRET MISSING]'
    });
    
    // Create a test file if it doesn't exist
    const testFilePath = path.join(__dirname, 'test-image.png');
    if (!fs.existsSync(testFilePath)) {
      // Generate a simple PNG (a 1x1 transparent pixel)
      const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      fs.writeFileSync(testFilePath, Buffer.from(base64Data, 'base64'));
      console.log('Created test image file:', testFilePath);
    }
    
    // Upload the file to Cloudinary
    console.log('Uploading to Cloudinary...');
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        testFilePath,
        {
          folder: 'test',
          resource_type: 'image',
          public_id: `test-upload-${Date.now()}`,
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    console.log('✅ Cloudinary upload successful!');
    console.log('Upload result URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    // Clean up - delete the test file from Cloudinary
    console.log('\nCleaning up - deleting test file from Cloudinary...');
    const deleteResult = await cloudinary.uploader.destroy(result.public_id);
    console.log('Deletion result:', deleteResult.result);
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    return false;
  }
}

// Run the test
testDirectUpload()
  .then(success => {
    console.log('\nTest completed:', success ? '✅ SUCCESS' : '❌ FAILED');
    if (!success) {
      console.log('Please check your Cloudinary credentials in the .env file.');
    }
    process.exit(success ? 0 : 1);
  }); 