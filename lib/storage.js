const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/properties',
    'uploads/hero',
    'uploads/team',
    'uploads/blog',
    'uploads/avatars'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Storage configuration for different types
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const safeFilename = `${name}-${uniqueSuffix}${ext}`;
      cb(null, safeFilename);
    }
  });
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer for different upload types
const uploadConfigs = {
  properties: multer({
    storage: createStorage('uploads/properties'),
    fileFilter: imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 10 // Maximum 10 files
    }
  }),
  
  hero: multer({
    storage: createStorage('uploads/hero'),
    fileFilter: imageFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit for hero images
      files: 1
    }
  }),
  
  team: multer({
    storage: createStorage('uploads/team'),
    fileFilter: imageFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
      files: 1
    }
  }),
  
  blog: multer({
    storage: createStorage('uploads/blog'),
    fileFilter: imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 5
    }
  }),
  
  avatars: multer({
    storage: createStorage('uploads/avatars'),
    fileFilter: imageFilter,
    limits: {
      fileSize: 1 * 1024 * 1024, // 1MB limit
      files: 1
    }
  })
};

// Helper function to delete file
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Helper function to get file size
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

// Helper function to ensure file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// Clean up old files (for maintenance)
const cleanupOldFiles = (directory, maxAgeInDays = 30) => {
  const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000; // Convert to milliseconds
  const now = Date.now();
  
  try {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old file: ${filePath}`);
      }
    });
  } catch (error) {
    console.error(`Error cleaning up directory ${directory}:`, error);
  }
};

module.exports = {
  uploadConfigs,
  deleteFile,
  getFileSize,
  fileExists,
  cleanupOldFiles,
  createUploadDirs
};