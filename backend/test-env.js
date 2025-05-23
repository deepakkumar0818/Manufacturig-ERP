const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('Current directory:', __dirname);

// Check if .env file exists
try {
  const envPath = path.resolve(__dirname, '.env');
  console.log('Looking for .env file at:', envPath);
  
  if (fs.existsSync(envPath)) {
    console.log('.env file exists');
    console.log('File content:');
    console.log(fs.readFileSync(envPath, 'utf8'));
  } else {
    console.log('.env file does not exist');
  }
} catch (err) {
  console.error('Error checking .env file:', err);
}

// Load environment variables
console.log('Attempting to load .env file...');
const result = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Print environment variables
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'is set' : 'is NOT set');
if (process.env.MONGO_URI) {
  console.log('MONGO_URI value:', process.env.MONGO_URI);
}
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'is set' : 'is NOT set'); 