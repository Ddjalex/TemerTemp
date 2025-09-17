// Simple JavaScript type definitions for MongoDB models
// This replaces the Drizzle PostgreSQL schema since we're using MongoDB

// Type definitions that match our MongoDB models
export const propertyTypes = ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial'];
export const propertyStatuses = ['for-sale', 'for-rent', 'sold', 'rented', 'pending'];
export const userRoles = ['admin', 'agent', 'user'];
export const blogCategories = ['market-update', 'buying-guide', 'selling-guide', 'investment', 'neighborhood', 'tips', 'news'];
export const blogStatuses = ['draft', 'published', 'archived'];
export const settingTypes = ['string', 'number', 'boolean', 'object', 'array'];
export const settingCategories = ['general', 'company', 'contact', 'social', 'seo', 'theme', 'features'];

// Validation schemas for frontend forms (using simple JavaScript validation)
export function validateUser(userData) {
  const errors = {};
  
  if (!userData.username || userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!userData.email || !userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!userData.password || userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!userData.firstName || userData.firstName.length < 1) {
    errors.firstName = 'First name is required';
  }
  
  if (!userData.lastName || userData.lastName.length < 1) {
    errors.lastName = 'Last name is required';
  }
  
  if (!userData.role || !userRoles.includes(userData.role)) {
    errors.role = 'Please select a valid role';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateProperty(propertyData) {
  const errors = {};
  
  if (!propertyData.title || propertyData.title.length < 1) {
    errors.title = 'Property title is required';
  }
  
  if (!propertyData.description || propertyData.description.length < 1) {
    errors.description = 'Property description is required';
  }
  
  if (!propertyData.price || propertyData.price <= 0) {
    errors.price = 'Please enter a valid price';
  }
  
  if (!propertyData.propertyType || !propertyTypes.includes(propertyData.propertyType)) {
    errors.propertyType = 'Please select a valid property type';
  }
  
  if (!propertyData.status || !propertyStatuses.includes(propertyData.status)) {
    errors.status = 'Please select a valid status';
  }
  
  // Complete address validation (street, city, state, zipCode required)
  if (!propertyData.address || 
      !propertyData.address.street || 
      !propertyData.address.city ||
      !propertyData.address.state ||
      !propertyData.address.zipCode) {
    errors.address = 'Please provide complete address information (street, city, state, zip code)';
  }
  
  // Complete features validation (bedrooms, bathrooms, sqft required)
  if (!propertyData.features || 
      !propertyData.features.bedrooms || 
      !propertyData.features.bathrooms ||
      !propertyData.features.sqft ||
      propertyData.features.sqft <= 0) {
    errors.features = 'Please provide property features (bedrooms, bathrooms, square footage)';
  }
  
  // Agent is required (references User model)
  if (!propertyData.agent) {
    errors.agent = 'Please assign an agent to this property';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateBlogPost(postData) {
  const errors = {};
  
  if (!postData.title || postData.title.length < 1) {
    errors.title = 'Blog title is required';
  }
  
  if (!postData.excerpt || postData.excerpt.length < 1) {
    errors.excerpt = 'Blog excerpt is required';
  }
  
  if (!postData.content || postData.content.length < 1) {
    errors.content = 'Blog content is required';
  }
  
  if (!postData.category || !blogCategories.includes(postData.category)) {
    errors.category = 'Please select a valid category';
  }
  
  if (!postData.status || !blogStatuses.includes(postData.status)) {
    errors.status = 'Please select a valid status';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

// Utility functions
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}
