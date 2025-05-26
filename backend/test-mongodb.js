const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('MongoDB Connection Test');
console.log('======================');
console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'Found' : 'Not found');

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI environment variable not found');
  process.exit(1);
}

// Connect to MongoDB
console.log('\nAttempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('\n✅ Connected to MongoDB successfully!');
  console.log('Connection details:');
  console.log('- Host:', mongoose.connection.host);
  console.log('- Database Name:', mongoose.connection.name);
  console.log('- Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
  
  // List collection names if available
  return mongoose.connection.db.listCollections().toArray();
})
.then(collections => {
  console.log('\nCollections in database:');
  if (collections.length > 0) {
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
  } else {
    console.log('No collections found in the database');
  }
  mongoose.connection.close();
  console.log('\nConnection closed.');
})
.catch(error => {
  console.error('\n❌ MongoDB connection failed:');
  console.error('Error type:', error.name);
  console.error('Error message:', error.message);
  console.error('\nTroubleshooting tips:');
  console.error('1. Check if your MongoDB URI is correct and properly formatted');
  console.error('2. Ensure your username and password are correct');
  console.error('3. Check if your IP address is whitelisted in MongoDB Atlas');
  console.error('4. Verify that your MongoDB instance is running');
  
  process.exit(1);
}); 