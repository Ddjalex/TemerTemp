const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('uuid');

// Sanitize HTML content for blog posts and descriptions
const sanitizeContent = (html, options = {}) => {
  const defaultOptions = {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };
  return sanitizeHtml(html, mergedOptions);
};

// Generate a slug from text
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Format currency
const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.DateTimeFormat('en-US', mergedOptions).format(new Date(date));
};

// Calculate reading time
const calculateReadingTime = (text, wordsPerMinute = 200) => {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return Math.max(1, time);
};

// Pagination helper
const paginate = (page = 1, limit = 10, total = 0) => {
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;
  
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    total,
    skip,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (US format)
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1]?[\s]?[\(]?[0-9]{3}[\)]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Format phone number
const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Generate random string
const generateRandomString = (length = 32) => {
  return uuidv4().replace(/-/g, '').substring(0, length);
};

// Capitalize first letter
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
const truncate = (text, maxLength = 100, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove empty values from object
const removeEmpty = (obj) => {
  const cleaned = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nested = removeEmpty(value);
        if (Object.keys(nested).length > 0) {
          cleaned[key] = nested;
        }
      } else if (Array.isArray(value) && value.length > 0) {
        cleaned[key] = value;
      } else if (typeof value !== 'object') {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

// Error response helper
const sendError = (res, message, statusCode = 500, details = null) => {
  const error = { error: message };
  if (details && process.env.NODE_ENV !== 'production') {
    error.details = details;
  }
  return res.status(statusCode).json(error);
};

// Success response helper
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { message };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  sanitizeContent,
  generateSlug,
  formatCurrency,
  formatDate,
  calculateReadingTime,
  paginate,
  isValidEmail,
  isValidPhone,
  formatPhone,
  generateRandomString,
  capitalize,
  truncate,
  deepClone,
  removeEmpty,
  sendError,
  sendSuccess
};