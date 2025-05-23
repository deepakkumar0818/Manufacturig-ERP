// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Setup Express App
const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend URLs
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow resources to be loaded from different origins
}));
app.use(morgan("dev"));

// Connect to MongoDB if MONGO_URI is provided, otherwise mock data
let usingMockData = false;

if (process.env.MONGO_URI) {
  // Try to connect to MongoDB
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Starting server without MongoDB...');
    usingMockData = true;
  });
} else {
  console.log('No MONGO_URI provided. Starting server without MongoDB...');
  usingMockData = true;
}

// Routes
app.get("/", (req, res) => {
  res.send(`API is running${usingMockData ? ' without MongoDB (mock data)' : ' with MongoDB'}...`);
});

// Use user routes
app.use('/api/users', require('./routes/userRoutes'));

// Mock data for enquiries when MongoDB is not available
const mockEnquiries = [];

// Mock APIs for enquiries when MongoDB is not available
if (usingMockData) {
  app.get('/api/enquiries', (req, res) => {
    res.json(mockEnquiries);
  });
  
  app.get('/api/enquiries/:id', (req, res) => {
    const enquiry = mockEnquiries.find(e => e._id === req.params.id);
    if (enquiry) {
      res.json(enquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  });
  
  app.get('/api/enquiries/custom/:customId', (req, res) => {
    const enquiry = mockEnquiries.find(e => e.id === req.params.customId);
    if (enquiry) {
      res.json(enquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  });
  
  app.post('/api/enquiries', (req, res) => {
    const { 
      customer,
      contactPerson,
      email,
      phone,
      product,
      quantity,
      // other fields...
    } = req.body;
    
    if (!customer || !contactPerson || !email || !phone || !product) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    
    const id = `ENQ-${String(mockEnquiries.length + 1).padStart(3, '0')}`;
    const newEnquiry = {
      _id: Date.now().toString(),
      id,
      date: new Date(),
      status: 'Open',
      ...req.body
    };
    
    mockEnquiries.push(newEnquiry);
    res.status(201).json(newEnquiry);
  });
  
  app.put('/api/enquiries/:id', (req, res) => {
    const index = mockEnquiries.findIndex(e => e._id === req.params.id);
    if (index !== -1) {
      mockEnquiries[index] = { ...mockEnquiries[index], ...req.body };
      res.json(mockEnquiries[index]);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  });
  
  app.delete('/api/enquiries/:id', (req, res) => {
    const index = mockEnquiries.findIndex(e => e._id === req.params.id);
    if (index !== -1) {
      mockEnquiries.splice(index, 1);
      res.json({ message: 'Enquiry removed' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  });
} else {
  // Use real MongoDB routes
  app.use('/api/enquiries', require('./routes/enquiryRoutes'));
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
