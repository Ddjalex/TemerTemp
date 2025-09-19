const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000
  },
  price: {
    type: Number,
    min: 0
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial']
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented', 'pending'],
    default: 'for-sale'
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'USA' }
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  features: {
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    sqft: { type: Number, min: 0 },
    lotSize: { type: Number },
    yearBuilt: { type: Number },
    garage: { type: Number, default: 0 },
    stories: { type: Number, default: 1 }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

// Index for location-based queries
propertySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Index for common filters
propertySchema.index({ propertyType: 1, status: 1, price: 1 });
propertySchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to get primary image
propertySchema.methods.getPrimaryImage = function() {
  const primaryImage = this.images.find(img => img.isPrimary);
  return primaryImage ? primaryImage.url : (this.images.length > 0 ? this.images[0].url : null);
};

module.exports = mongoose.model('Property', propertySchema);