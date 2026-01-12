const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', 'office']
  },
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['sale', 'rent', 'lease']
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'rented'],
    default: 'available'
  },
  // Location details
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  // Property details
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative']
  },
  squareFeet: {
    type: Number,
    min: [0, 'Square feet cannot be negative']
  },
  lotSize: {
    type: Number,
    min: [0, 'Lot size cannot be negative']
  },
  yearBuilt: {
    type: Number,
    min: [1800, 'Year built must be valid']
  },
  // Features and amenities
  features: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  // Media
  images: [{
    url: { type: String, required: true },
    publicId: String,
    caption: String
  }],
  virtualTour: {
    type: String,
    trim: true
  },
  // Owner/Agent info
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Stats
  views: {
    type: Number,
    default: 0
  },
  // Additional info
  parking: {
    type: String,
    enum: ['none', 'street', 'garage', 'carport', 'driveway']
  },
  heating: String,
  cooling: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for text search
propertySchema.index({ title: 'text', description: 'text' });

// Virtual for reviews
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property'
});

module.exports = mongoose.model('Property', propertySchema);
