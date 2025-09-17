/**
 * API Communication Module
 * Handles all API requests to the backend using fetch
 */

(function() {
    'use strict';

    const BASE_URL = window.location.origin;
    const API_BASE = `${BASE_URL}/api`;

    // Default request options
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies for session management
    };

    // Helper function to handle API responses
    async function handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use default error message
                }
            }
            
            throw new Error(errorMessage);
        }

        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    }

    // Generic API request function
    async function apiRequest(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            return await handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // API Module
    window.TemerAPI = {
        // Initialize API module
        init: function() {
            console.log('Temer API module initialized');
            // Could set up interceptors, auth tokens, etc.
        },

        // Generic request methods
        request: apiRequest,

        get: function(endpoint, options = {}) {
            return apiRequest(endpoint, { ...options, method: 'GET' });
        },

        post: function(endpoint, data, options = {}) {
            return apiRequest(endpoint, {
                ...options,
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        put: function(endpoint, data, options = {}) {
            return apiRequest(endpoint, {
                ...options,
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        patch: function(endpoint, data, options = {}) {
            return apiRequest(endpoint, {
                ...options,
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },

        delete: function(endpoint, options = {}) {
            return apiRequest(endpoint, { ...options, method: 'DELETE' });
        },

        // Property-related API calls
        properties: {
            // Get all properties with optional filters
            getAll: function(filters = {}) {
                const params = new URLSearchParams(filters);
                const queryString = params.toString();
                return window.TemerAPI.get(`/properties${queryString ? '?' + queryString : ''}`);
            },

            // Get a single property by ID
            getById: function(id) {
                return window.TemerAPI.get(`/properties/${id}`);
            },

            // Get featured properties
            getFeatured: function() {
                return window.TemerAPI.get('/properties?featured=true');
            },

            // Search properties
            search: function(searchParams) {
                return window.TemerAPI.post('/properties/search', searchParams);
            }
        },

        // Team/Agent-related API calls
        agents: {
            // Get all agents
            getAll: function() {
                return window.TemerAPI.get('/agents');
            },

            // Get a single agent by ID
            getById: function(id) {
                return window.TemerAPI.get(`/agents/${id}`);
            },

            // Get top performing agents
            getTop: function(limit = 6) {
                return window.TemerAPI.get(`/agents?top=${limit}`);
            }
        },

        // Blog-related API calls
        blog: {
            // Get all blog posts
            getAll: function(page = 1, limit = 10) {
                return window.TemerAPI.get(`/blog?page=${page}&limit=${limit}`);
            },

            // Get a single blog post by ID
            getById: function(id) {
                return window.TemerAPI.get(`/blog/${id}`);
            },

            // Get latest blog posts
            getLatest: function(limit = 3) {
                return window.TemerAPI.get(`/blog?latest=${limit}`);
            },

            // Get blog posts by category
            getByCategory: function(category) {
                return window.TemerAPI.get(`/blog?category=${category}`);
            }
        },

        // Contact-related API calls
        contact: {
            // Submit contact form
            submit: function(contactData) {
                return window.TemerAPI.post('/contact', contactData);
            },

            // Submit newsletter subscription
            newsletter: function(email) {
                return window.TemerAPI.post('/newsletter', { email });
            },

            // Submit property inquiry
            propertyInquiry: function(inquiryData) {
                return window.TemerAPI.post('/contact/property-inquiry', inquiryData);
            },

            // Schedule property viewing
            scheduleViewing: function(viewingData) {
                return window.TemerAPI.post('/contact/schedule-viewing', viewingData);
            }
        },

        // Settings and general info
        settings: {
            // Get company settings/info
            getCompanyInfo: function() {
                return window.TemerAPI.get('/settings/company');
            },

            // Get office locations
            getOfficeLocations: function() {
                return window.TemerAPI.get('/settings/offices');
            }
        },

        // Utility methods for common patterns
        utils: {
            // Handle form submission with loading states
            async submitForm(form, endpoint, options = {}) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalButtonText = submitButton ? submitButton.innerHTML : '';
                
                if (submitButton) {
                    window.TemerUtils.showLoading(submitButton);
                    submitButton.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Submitting...';
                    submitButton.disabled = true;
                }

                try {
                    const result = await window.TemerAPI.post(endpoint, data, options);
                    
                    // Success feedback
                    if (window.TemerUtils) {
                        window.TemerUtils.showToast(
                            options.successMessage || 'Form submitted successfully!', 
                            'success'
                        );
                    }
                    
                    // Reset form if specified
                    if (options.resetForm !== false) {
                        form.reset();
                    }
                    
                    return result;
                } catch (error) {
                    // Error feedback
                    if (window.TemerUtils) {
                        window.TemerUtils.showToast(
                            options.errorMessage || error.message || 'An error occurred. Please try again.', 
                            'error'
                        );
                    }
                    throw error;
                } finally {
                    // Restore button state
                    if (submitButton) {
                        window.TemerUtils.hideLoading(submitButton);
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                        
                        // Re-initialize lucide icons
                        if (window.lucide) {
                            window.lucide.createIcons();
                        }
                    }
                }
            },

            // Load data with loading states
            async loadWithLoading(container, loadFunction, options = {}) {
                if (!container) return null;

                // Show skeleton loading
                if (options.showSkeleton !== false) {
                    container.innerHTML = this.createSkeletonHTML(options.skeletonType || 'card');
                }

                try {
                    const data = await loadFunction();
                    return data;
                } catch (error) {
                    // Show error state
                    container.innerHTML = this.createErrorHTML(error.message, options.retryCallback);
                    throw error;
                }
            },

            // Create skeleton loading HTML
            createSkeletonHTML: function(type = 'card', count = 3) {
                const skeletonCard = `
                    <div class="card">
                        <div class="skeleton h-48 w-full mb-4"></div>
                        <div class="card-content">
                            <div class="skeleton h-6 w-3/4 mb-2"></div>
                            <div class="skeleton h-4 w-1/2 mb-4"></div>
                            <div class="skeleton h-10 w-full"></div>
                        </div>
                    </div>
                `;

                const skeletonList = `
                    <div class="card p-4">
                        <div class="skeleton h-4 w-full mb-2"></div>
                        <div class="skeleton h-4 w-3/4 mb-2"></div>
                        <div class="skeleton h-4 w-1/2"></div>
                    </div>
                `;

                const template = type === 'list' ? skeletonList : skeletonCard;
                return Array(count).fill(template).join('');
            },

            // Create error HTML
            createErrorHTML: function(message, retryCallback) {
                const retryButton = retryCallback ? 
                    `<button class="btn btn-primary mt-4" onclick="(${retryCallback.toString()})()">Try Again</button>` : 
                    '';

                return `
                    <div class="text-center py-8">
                        <i data-lucide="alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-semibold mb-2">Something went wrong</h3>
                        <p class="text-muted-foreground mb-4">${message}</p>
                        ${retryButton}
                    </div>
                `;
            }
        }
    };

    // Auto-initialize when the module loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.TemerAPI.init());
    } else {
        window.TemerAPI.init();
    }

})();