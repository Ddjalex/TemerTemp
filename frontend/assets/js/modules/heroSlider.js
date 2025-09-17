/**
 * Hero Slider Module
 * Handles hero section slideshow functionality
 */

(function() {
    'use strict';

    const HERO_SLIDES = [
        {
            id: 1,
            image: "./assets/images/Luxury_villa_hero_image_3dfce514.png",
            title: "Luxury Villa with Ocean View",
            subtitle: "Experience the finest in coastal living",
            price: "$2,850,000",
            location: "Miami Beach, FL",
            beds: 5,
            baths: 4,
            sqft: "4,200"
        },
        {
            id: 2,
            image: "./assets/images/Modern_family_home_600a02bb.png",
            title: "Modern Family Home",
            subtitle: "Perfect for growing families",
            price: "$875,000",
            location: "Coral Gables, FL", 
            beds: 4,
            baths: 3,
            sqft: "3,100"
        },
        {
            id: 3,
            image: "./assets/images/Downtown_luxury_condo_15b7acf1.png",
            title: "Downtown Luxury Condominium",
            subtitle: "Urban sophistication at its finest",
            price: "$1,250,000",
            location: "Downtown Miami, FL",
            beds: 3,
            baths: 2,
            sqft: "2,400"
        }
    ];

    let currentSlideIndex = 0;
    let slideTimer = null;
    let isTransitioning = false;

    function updateHeroContent(slide) {
        const elements = {
            bg: document.getElementById('heroBg'),
            title: document.getElementById('heroTitle'),
            subtitle: document.getElementById('heroSubtitle'),
            price: document.getElementById('heroPrice'),
            location: document.getElementById('heroLocation'),
            beds: document.getElementById('heroBeds'),
            baths: document.getElementById('heroBaths'),
            sqft: document.getElementById('heroSqft')
        };

        if (elements.bg) elements.bg.src = slide.image;
        if (elements.title) elements.title.textContent = slide.title;
        if (elements.subtitle) elements.subtitle.textContent = slide.subtitle;
        if (elements.price) elements.price.textContent = slide.price;
        if (elements.location) elements.location.textContent = slide.location;
        if (elements.beds) elements.beds.textContent = slide.beds;
        if (elements.baths) elements.baths.textContent = slide.baths;
        if (elements.sqft) elements.sqft.textContent = slide.sqft;
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

        initializeSlider: function() {
            // Set initial slide
            if (HERO_SLIDES.length > 0) {
                updateHeroContent(HERO_SLIDES[0]);
                startAutoSlide();
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