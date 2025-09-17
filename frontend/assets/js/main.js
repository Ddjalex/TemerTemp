/**
 * Temer Properties - Main JavaScript File
 * Handles global functionality and page initialization
 */

(function() {
    'use strict';

    // Global utility functions
    window.TemerUtils = {
        // Format phone number for calling
        formatPhoneForCall: function(phone) {
            return phone.replace(/[^\d+]/g, '');
        },

        // Format phone number for WhatsApp
        formatPhoneForWhatsApp: function(phone) {
            return phone.replace(/[^\d]/g, '');
        },

        // Generate WhatsApp message URL
        generateWhatsAppUrl: function(phone, message) {
            const cleanPhone = this.formatPhoneForWhatsApp(phone);
            const encodedMessage = encodeURIComponent(message);
            return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        },

        // Show loading state
        showLoading: function(element) {
            if (element) {
                element.classList.add('skeleton');
                element.style.pointerEvents = 'none';
            }
        },

        // Hide loading state
        hideLoading: function(element) {
            if (element) {
                element.classList.remove('skeleton');
                element.style.pointerEvents = 'auto';
            }
        },

        // Format price
        formatPrice: function(price) {
            if (typeof price === 'number') {
                return '$' + price.toLocaleString();
            }
            return price;
        },

        // Format currency for display
        formatCurrency: function(amount) {
            if (typeof amount === 'number') {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            }
            return amount;
        },

        // Debounce function for search
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = function() {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Toast notification system
        showToast: function(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: hsl(var(--card));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
                padding: 1rem 1.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            `;
            
            const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info';
            const iconColor = type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-blue-600';
            
            toast.innerHTML = `
                <div class="flex items-center gap-2">
                    <i data-lucide="${icon}" class="w-5 h-5 ${iconColor}"></i>
                    <span>${message}</span>
                    <button class="toast-close ml-auto" onclick="this.parentElement.parentElement.remove()">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Initialize lucide icons for the toast
            if (window.lucide) {
                window.lucide.createIcons();
            }
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => toast.remove(), 300);
                }
            }, 5000);
        }
    };

    // Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                
                // Toggle icon
                const icon = mobileMenuToggle.querySelector('[data-lucide]');
                if (icon) {
                    const isOpen = mobileMenu.classList.contains('active');
                    icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                }
            });

            // Close mobile menu when clicking on links
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('[data-lucide]');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        if (window.lucide) {
                            window.lucide.createIcons();
                        }
                    }
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('[data-lucide]');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        if (window.lucide) {
                            window.lucide.createIcons();
                        }
                    }
                }
            });
        }
    }

    // Newsletter form functionality
    function initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(newsletterForm);
                const email = formData.get('email');
                
                // Simulate API call
                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                TemerUtils.showLoading(submitButton);
                submitButton.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Subscribing...';
                
                setTimeout(() => {
                    TemerUtils.hideLoading(submitButton);
                    submitButton.innerHTML = originalText;
                    
                    if (window.lucide) {
                        window.lucide.createIcons();
                    }
                    
                    TemerUtils.showToast('Thank you for subscribing to our newsletter!', 'success');
                    newsletterForm.reset();
                }, 1500);
                
                console.log('Newsletter subscription:', email);
            });
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Back to top functionality
    function initBackToTop() {
        // Create back to top button
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
        backToTopButton.className = 'btn btn-primary btn-icon fixed bottom-6 right-6 opacity-0 pointer-events-none transition-all duration-300 z-50';
        backToTopButton.id = 'backToTop';
        backToTopButton.setAttribute('data-testid', 'button-back-to-top');
        document.body.appendChild(backToTopButton);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                backToTopButton.classList.add('opacity-100');
            } else {
                backToTopButton.classList.add('opacity-0', 'pointer-events-none');
                backToTopButton.classList.remove('opacity-100');
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initialize lucide icons for the button
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Initialize fade-in animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        document.querySelectorAll('.card, .team-grid > *, .property-grid > *').forEach(el => {
            observer.observe(el);
        });
    }

    // Add animation keyframes if not already present
    function addAnimationStyles() {
        const styleId = 'temer-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                
                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize everything when DOM is loaded
    function init() {
        initMobileMenu();
        initNewsletterForm();
        initSmoothScrolling();
        initBackToTop();
        initAnimations();
        addAnimationStyles();
        
        // Initialize lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose init function globally
    window.TemerMain = {
        init: init,
        utils: window.TemerUtils
    };

})();