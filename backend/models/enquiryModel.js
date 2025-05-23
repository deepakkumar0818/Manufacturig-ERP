const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    industry: {
      type: String,
    },
    product: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    specs: {
      type: String,
    },
    drawings: {
      type: String,
    },
    expectedDelivery: {
      type: String,
    },
    projectTimeline: {
      type: String,
    },
    budget: {
      type: String,
    },
    preferredMaterial: {
      type: String,
    },
    additionalServices: {
      type: [String],
      default: [],
    },
    referenceSource: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'Open',
      enum: ['Open', 'Quoted', 'Converted', 'Closed'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry; 