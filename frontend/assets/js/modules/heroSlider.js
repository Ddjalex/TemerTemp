/**
 * Hero Slider Module
 * Handles hero section slideshow functionality
 */

(function() {
    'use strict';

    let HERO_SLIDES = [];

    // Fetch hero slides from API
    async function fetchHeroSlides() {
        try {
            const response = await fetch('/api/hero');
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                HERO_SLIDES = result.data.map(slide => ({
                    id: slide._id,
                    image: slide.image.url,
                    title: slide.title,
                    subtitle: slide.subtitle,
                    description: slide.description,
                    buttonText: slide.ctaButton?.text || 'Learn More',
                    buttonLink: slide.ctaButton?.link || '/listings'
                }));
            } else {
                // Fallback to default message when no slides available
                HERO_SLIDES = [{
                    id: 'default',
                    image: './assets/images/temer-logo.jpg',
                    title: 'Welcome to Temer Properties',
                    subtitle: 'Your Premier Real Estate Partner',
                    description: 'Discover exceptional properties that match your lifestyle and budget.',
                    buttonText: 'View Properties',
                    buttonLink: '/listings'
                }];
            }
            
            return HERO_SLIDES;
        } catch (error) {
            console.error('Failed to fetch hero slides:', error);
            // Fallback content on API error
            HERO_SLIDES = [{
                id: 'fallback',
                image: './assets/images/temer-logo.jpg',
                title: 'Welcome to Temer Properties',
                subtitle: 'Your Premier Real Estate Partner',
                description: 'Discover exceptional properties that match your lifestyle and budget.',
                buttonText: 'View Properties',
                buttonLink: '/listings'
            }];
            return HERO_SLIDES;
        }
    }

    let currentSlideIndex = 0;
    let slideTimer = null;
    let isTransitioning = false;

    function updateHeroContent(slide) {
        const elements = {
            bg: document.getElementById('heroBg'),
            title: document.getElementById('heroTitle'),
            subtitle: document.getElementById('heroSubtitle'),
            description: document.getElementById('heroDescription'),
            button: document.getElementById('heroButton')
        };

        if (elements.bg) {
            elements.bg.src = slide.image;
            elements.bg.alt = slide.title;
        }
        if (elements.title) elements.title.textContent = slide.title;
        if (elements.subtitle) elements.subtitle.textContent = slide.subtitle;
        if (elements.description) elements.description.textContent = slide.description;
        if (elements.button) {
            elements.button.textContent = slide.buttonText;
            elements.button.href = slide.buttonLink;
        }
    }

    function transitionToSlide(index) {
        if (isTransitioning || index === currentSlideIndex) return;
        
        isTransitioning = true;
        const slide = HERO_SLIDES[index];
        
        // Add fade-out effect
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
        }

        // Update content after fade-out
        setTimeout(() => {
            updateHeroContent(slide);
            currentSlideIndex = index;
            
            // Fade back in
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
            
            isTransitioning = false;
        }, 300);
    }

    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % HERO_SLIDES.length;
        transitionToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
        transitionToSlide(prevIndex);
    }

    function startAutoSlide() {
        slideTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function initHeroSearch() {
        const heroSearchForm = document.getElementById('heroSearchForm');
        if (heroSearchForm) {
            heroSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(heroSearchForm);
                const searchData = {
                    location: formData.get('location') || document.getElementById('searchLocation')?.value,
                    propertyType: formData.get('propertyType') || document.getElementById('propertyType')?.value,
                    priceRange: formData.get('priceRange') || document.getElementById('priceRange')?.value
                };
                
                console.log('Hero search triggered:', searchData);
                
                if (window.TemerUtils) {
                    window.TemerUtils.showToast('Searching properties...', 'info');
                }
                
                // Simulate search delay
                setTimeout(() => {
                    // In a real app, navigate to listings page with filters
                    const params = new URLSearchParams();
                    if (searchData.location) params.set('location', searchData.location);
                    if (searchData.propertyType) params.set('type', searchData.propertyType);
                    if (searchData.priceRange) params.set('price', searchData.priceRange);
                    
                    const url = `./pages/listings.html${params.toString() ? '?' + params.toString() : ''}`;
                    // window.location.href = url;
                    
                    if (window.TemerUtils) {
                        window.TemerUtils.showToast(`Found properties matching your criteria!`, 'success');
                    }
                }, 1000);
            });
        }
    }

    function addHeroStyles() {
        const styleId = 'hero-slider-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .hero-content {
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                }
                
                .hero-bg {
                    transition: opacity 0.5s ease-in-out;
                }
                
                .hero .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-lg);
                }
                
                .hero-content > * {
                    animation-delay: var(--delay, 0ms);
                }
                
                .hero-content h1 { --delay: 100ms; }
                .hero-content p { --delay: 200ms; }
                .hero-content .flex { --delay: 300ms; }
                .hero-content .bg-white\\/10 { --delay: 400ms; }
                
                @media (max-width: 768px) {
                    .hero-content h1 {
                        font-size: 2rem;
                        line-height: 1.2;
                    }
                    
                    .hero-content p {
                        font-size: 1.125rem;
                    }
                    
                    .hero-content .flex {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .hero-content .bg-white\\/10 {
                        padding: 1rem;
                    }
                    
                    .hero-content .grid {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Hero Slider Module
    window.HeroSlider = {
        init: function() {
            addHeroStyles();
            this.setupEventListeners();
            this.initializeSlider();
            initHeroSearch();
        },

        setupEventListeners: function() {
            // Navigation buttons
            const nextButton = document.getElementById('nextSlide');
            const prevButton = document.getElementById('prevSlide');
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    nextSlide();
                    resetAutoSlide();
                });
            }
            
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    prevSlide();
                    resetAutoSlide();
                });
            }

            // Pause auto-slide on hero hover
            const heroSection = document.getElementById('heroSection');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', stopAutoSlide);
                heroSection.addEventListener('mouseleave', startAutoSlide);
            }

            // Handle keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoSlide();
                }
            });

            // Handle touch/swipe gestures (basic implementation)
            let touchStartX = null;
            if (heroSection) {
                heroSection.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                });

                heroSection.addEventListener('touchend', (e) => {
                    if (touchStartX === null) return;
                    
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchStartX - touchEndX;
                    
                    if (Math.abs(diff) > 50) { // Minimum swipe distance
                        if (diff > 0) {
                            nextSlide(); // Swipe left -> next slide
                        } else {
                            prevSlide(); // Swipe right -> previous slide
                        }
                        resetAutoSlide();
                    }
                    
                    touchStartX = null;
                });
            }
        },

        initializeSlider: async function() {
            // Fetch slides from API first
            await fetchHeroSlides();
            
            // Set initial slide
            if (HERO_SLIDES.length > 0) {
                updateHeroContent(HERO_SLIDES[0]);
                if (HERO_SLIDES.length > 1) {
                    startAutoSlide();
                }
            }
        },

        // Public methods for external control
        goToSlide: function(index) {
            if (index >= 0 && index < HERO_SLIDES.length) {
                transitionToSlide(index);
                resetAutoSlide();
            }
        },

        next: nextSlide,
        prev: prevSlide,
        
        pause: stopAutoSlide,
        resume: startAutoSlide,
        
        getCurrentSlide: function() {
            return currentSlideIndex;
        },
        
        getTotalSlides: function() {
            return HERO_SLIDES.length;
        }
    };

})();