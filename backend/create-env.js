const fs = require('fs');

const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://ErpManufacturin_User:STsFL6ocfnwsNl27@erpmanufacturing.hki38rv.mongodb.net/
JWT_SECRET=abc123

# Add your Cloudinary credentials here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`;

fs.writeFileSync('.env', envContent, 'utf8');

console.log('Successfully created .env file'); 