# Overview

Temer Properties is a comprehensive real estate platform featuring a static frontend website and a Node.js backend with admin dashboard. The project provides a professional real estate experience with property listings, team member profiles, blog functionality, and complete content management capabilities. The architecture supports both public-facing property browsing and secure administrative operations for managing all site content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static Site Structure**: Built as a pure HTML/CSS/JavaScript static website without build tools
- **Component-Based Design**: Uses vanilla JavaScript modules with IIFE pattern for component isolation
- **Responsive Design**: Tailwind CSS via CDN for mobile-first responsive layouts
- **API Integration**: Fetch-based communication with backend using CORS-enabled endpoints
- **Page Structure**: Dedicated pages for home, listings, property details, team, blog, about, and contact

## Backend Architecture
- **Node.js/Express Framework**: CommonJS-based server with session management
- **Dual Route System**: 
  - `/api/*` routes for JSON API consumed by frontend
  - `/admin/*` routes for server-rendered admin dashboard using EJS templates
- **Session-Based Authentication**: Express-session with connect-mongo for admin login persistence
- **File Upload Support**: Multer integration for property images and media management
- **Security Middleware**: Helmet, CORS, compression, and CSRF protection
- **Template Engine**: EJS for server-side rendering of admin interface

## Data Storage Solutions
- **Primary Database**: MongoDB Atlas for all application data
- **Session Storage**: MongoDB session store using connect-mongo
- **File Storage**: Local file system for uploaded property images and documents
- **Schema Design**: Mongoose models for properties, team members, blog posts, hero content, and site settings

## Authentication and Authorization
- **Admin Authentication**: Email/password login with bcrypt hashing
- **Session Management**: Server-side sessions with secure cookie configuration
- **Access Control**: Middleware-based route protection for all admin endpoints
- **Public API**: Open access for frontend consumption with rate limiting considerations

## Content Management
- **Property Management**: Full CRUD operations for listings with image uploads
- **Team Management**: Agent profiles with contact information and specialties
- **Blog System**: Content creation with rich text editing capabilities
- **Hero Section**: Configurable homepage sliders and featured content
- **Site Settings**: Centralized configuration for contact info, social media, and SEO

# External Dependencies

## Database Services
- **MongoDB Atlas**: Primary database hosting with connection string authentication
- **Connection Management**: Mongoose ODM for schema definition and query operations

## Frontend Libraries
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Lucide Icons**: Icon library for consistent visual elements
- **Google Fonts**: Inter and Poppins font families for typography

## Backend Dependencies
- **Express.js**: Web application framework with middleware support
- **Authentication**: bcrypt for password hashing, express-session for session management
- **Security**: helmet for security headers, cors for cross-origin requests
- **File Handling**: multer for multipart form uploads, uuid for unique identifiers
- **Validation**: express-validator for input sanitization and validation
- **Template Engine**: EJS for server-side HTML rendering

## Development Tools
- **Environment Configuration**: dotenv for environment variable management
- **Process Management**: Standard Node.js process handling for production deployment
- **Error Handling**: Custom middleware for centralized error processing

## Deployment Infrastructure
- **cPanel Hosting**: Apache/Passenger configuration for Node.js deployment
- **Static Asset Serving**: Express static middleware for frontend file delivery
- **Environment Variables**: Production configuration for database connections and session secrets