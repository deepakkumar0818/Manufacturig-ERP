const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('Error: MONGO_URI environment variable is not defined');
      console.error('Please create a .env file with MONGO_URI=your_mongodb_connection_string');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
    });

    console.log(` Deepak MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Special handling for specific MongoDB errors
    if (error.name === 'MongoNetworkError') {
      console.error('Network error - please check your internet connection or MongoDB URI');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Server selection error - MongoDB server may be down or unreachable');
    } else if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string - please check your MONGO_URI format');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 