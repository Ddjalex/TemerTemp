/**
 * Property Cards Module
 * Handles property card rendering and interactions
 */

(function() {
    'use strict';

    // Sample property data (matches the React version)
    const SAMPLE_PROPERTIES = [
        {
            id: "1",
            title: "Luxury Villa with Ocean View",
            price: "$2,850,000",
            location: "Miami Beach, FL",
            beds: 5,
            baths: 4,
            sqft: "4,200",
            image: "./assets/images/Luxury_villa_hero_image_3dfce514.png",
            status: "sale",
            featured: true
        },
        {
            id: "2", 
            title: "Modern Family Home",
            price: "$875,000",
            location: "Coral Gables, FL",
            beds: 4,
            baths: 3,
            sqft: "3,100",
            image: "./assets/images/Modern_family_home_600a02bb.png",
            status: "sale",
            featured: true
        },
        {
            id: "3",
            title: "Downtown Luxury Condominium", 
            price: "$1,250,000",
            location: "Downtown Miami, FL",
            beds: 3,
            baths: 2,
            sqft: "2,400",
            image: "./assets/images/Downtown_luxury_condo_15b7acf1.png",
            status: "sale",
            featured: true
        }
    ];

    // Sample team data
    const SAMPLE_AGENTS = [
        {
            id: "1",
            name: "Sarah Johnson",
            role: "Senior Real Estate Agent", 
            photo: "./assets/images/Real_estate_agent_portrait_fda206b8.png",
            phone: "+1 (555) 123-4567",
            email: "sarah.johnson@temerproperties.com",
            specialties: ["Luxury Homes", "Waterfront", "Investment"],
            rating: 4.8,
            salesCount: 127
        },
        {
            id: "2",
            name: "Michael Chen",
            role: "Real Estate Specialist",
            photo: "./assets/images/Male_agent_portrait_8ad97304.png", 
            phone: "+1 (555) 234-5678",
            email: "michael.chen@temerproperties.com",
            specialties: ["First-Time Buyers", "Condos", "Commercial"],
            rating: 4.9,
            salesCount: 98
        }
    ];

    // Sample blog posts
    const SAMPLE_BLOG_POSTS = [
        {
            id: "1",
            title: "2024 Real Estate Market Trends: What Buyers Need to Know",
            excerpt: "Discover the latest trends shaping the real estate market this year, from pricing fluctuations to emerging neighborhoods and investment opportunities.",
            coverImage: "./assets/images/Modern_apartment_interior_61087e44.png",
            author: {
                name: "Sarah Johnson",
                avatar: "./assets/images/Real_estate_agent_portrait_fda206b8.png"
            },
            publishDate: "Mar 15, 2024",
            readTime: "5 min read", 
            category: "Market Insights"
        },
        {
            id: "2",
            title: "First-Time Home Buyer's Complete Guide",
            excerpt: "Everything you need to know about purchasing your first home, from mortgage pre-approval to closing day.",
            coverImage: "./assets/images/Modern_family_home_600a02bb.png",
            author: {
                name: "Michael Chen", 
                avatar: "./assets/images/Male_agent_portrait_8ad97304.png"
            },
            publishDate: "Mar 10, 2024",
            readTime: "8 min read",
            category: "Buying Guide"
        },
        {
            id: "3",
            title: "Investment Property ROI: Maximizing Your Returns",
            excerpt: "Learn how to calculate and optimize your real estate investment returns in today's market.",
            coverImage: "./assets/images/Downtown_luxury_condo_15b7acf1.png",
            author: {
                name: "Sarah Johnson",
                avatar: "./assets/images/Real_estate_agent_portrait_fda206b8.png"
            },
            publishDate: "Mar 5, 2024",
            readTime: "6 min read",
            category: "Investment"
        }
    ];

    function getStatusColor(status) {
        switch (status) {
            case 'sale': return 'badge-primary';
            case 'rent': return 'badge-secondary';
            case 'sold': return 'badge-accent';
            default: return 'badge-secondary';
        }
    }

    function getStatusText(status) {
        switch (status) {
            case 'sale': return 'For Sale';
            case 'rent': return 'For Rent';
            case 'sold': return 'Sold';
            default: return status;
        }
    }

    function createPropertyCard(property) {
        return `
            <div class="card property-card hover-elevate" data-testid="card-property-${property.id}">
                <div class="relative">
                    <img
                        src="${property.image}"
                        alt="${property.title}"
                        class="property-card-image"
                        loading="lazy"
                    />
                    
                    <!-- Status Badge -->
                    <div class="property-card-badge">
                        <span class="badge ${getStatusColor(property.status)}">
                            ${getStatusText(property.status)}
                        </span>
                    </div>
                    
                    <!-- Featured Badge -->
                    ${property.featured ? '<div class="absolute top-3 right-3"><span class="badge badge-accent">Featured</span></div>' : ''}
                    
                    <!-- Action Buttons -->
                    <div class="property-card-actions">
                        <button
                            class="btn btn-sm btn-ghost"
                            style="background-color: rgba(255,255,255,0.9); color: #374151; width: 2rem; height: 2rem; padding: 0;"
                            onclick="PropertyCards.handleFavorite('${property.id}')"
                            data-testid="button-favorite-${property.id}"
                        >
                            <i data-lucide="heart" class="w-4 h-4"></i>
                        </button>
                        <button
                            class="btn btn-sm btn-ghost"
                            style="background-color: rgba(255,255,255,0.9); color: #374151; width: 2rem; height: 2rem; padding: 0;"
                            onclick="PropertyCards.handleShare('${property.id}')"
                            data-testid="button-share-${property.id}"
                        >
                            <i data-lucide="share-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-semibold text-lg mb-1">${property.title}</h3>
                        <span class="text-2xl font-bold text-primary">${property.price}</span>
                    </div>
                    
                    <div class="flex items-center gap-1 text-muted-foreground mb-4">
                        <i data-lucide="map-pin" class="w-4 h-4"></i>
                        <span>${property.location}</span>
                    </div>
                    
                    <div class="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1">
                            <i data-lucide="bed" class="w-4 h-4"></i>
                            <span>${property.beds} beds</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <i data-lucide="bath" class="w-4 h-4"></i>
                            <span>${property.baths} baths</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <i data-lucide="square" class="w-4 h-4"></i>
                            <span>${property.sqft} sqft</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button
                            class="btn btn-primary flex-1"
                            onclick="PropertyCards.handleViewDetails('${property.id}')"
                            data-testid="button-view-details-${property.id}"
                        >
                            View Details
                        </button>
                        <button
                            class="btn btn-outline"
                            onclick="PropertyCards.handleCall('${property.id}')"
                            data-testid="button-call-${property.id}"
                        >
                            <i data-lucide="phone" class="w-4 h-4"></i>
                        </button>
                        <button
                            class="btn btn-outline"
                            onclick="PropertyCards.handleWhatsApp('${property.id}')"
                            data-testid="button-whatsapp-${property.id}"
                        >
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function createTeamMemberCard(agent) {
        return `
            <div class="card text-center hover-elevate" data-testid="card-agent-${agent.id}">
                <div class="card-content">
                    <img
                        src="${agent.photo}"
                        alt="${agent.name}"
                        class="team-member-avatar"
                        loading="lazy"
                    />
                    <h3 class="font-semibold text-xl mb-1">${agent.name}</h3>
                    <p class="text-muted-foreground mb-3">${agent.role}</p>
                    
                    <div class="flex items-center justify-center gap-2 mb-3">
                        <div class="flex">
                            ${Array(5).fill().map((_, i) => 
                                `<i data-lucide="star" class="w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>`
                            ).join('')}
                        </div>
                        <span class="text-sm text-muted-foreground">${agent.rating} (${agent.salesCount} sales)</span>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 mb-4 justify-center">
                        ${agent.specialties.map(specialty => 
                            `<span class="badge badge-secondary text-xs">${specialty}</span>`
                        ).join('')}
                    </div>
                    
                    <div class="flex gap-2">
                        <button
                            class="btn btn-primary flex-1"
                            onclick="PropertyCards.handleCall('${agent.phone}')"
                            data-testid="button-call-agent-${agent.id}"
                        >
                            <i data-lucide="phone" class="w-4 h-4"></i>
                            Call
                        </button>
                        <button
                            class="btn btn-outline flex-1"
                            onclick="PropertyCards.handleEmail('${agent.email}')"
                            data-testid="button-email-agent-${agent.id}"
                        >
                            <i data-lucide="mail" class="w-4 h-4"></i>
                            Email
                        </button>
                        <button
                            class="btn btn-outline"
                            onclick="PropertyCards.handleWhatsApp('${agent.phone}')"
                            data-testid="button-whatsapp-agent-${agent.id}"
                        >
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function createBlogCard(post) {
        return `
            <div class="card hover-elevate" data-testid="card-blog-${post.id}">
                <div class="relative">
                    <img
                        src="${post.coverImage}"
                        alt="${post.title}"
                        class="w-full h-48 object-cover"
                        loading="lazy"
                    />
                    <div class="absolute top-3 left-3">
                        <span class="badge badge-primary">${post.category}</span>
                    </div>
                </div>
                
                <div class="card-content">
                    <h3 class="font-semibold text-lg mb-3 line-clamp-2">${post.title}</h3>
                    <p class="text-muted-foreground mb-4 line-clamp-3">${post.excerpt}</p>
                    
                    <div class="flex items-center gap-3 mb-4">
                        <img
                            src="${post.author.avatar}"
                            alt="${post.author.name}"
                            class="w-8 h-8 rounded-full object-cover"
                        />
                        <div class="flex-1">
                            <p class="font-medium text-sm">${post.author.name}</p>
                            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>${post.publishDate}</span>
                                <span>•</span>
                                <span>${post.readTime}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        class="btn btn-outline w-full"
                        onclick="PropertyCards.handleReadMore('${post.id}')"
                        data-testid="button-read-more-${post.id}"
                    >
                        Read More
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Property Cards Module
    window.PropertyCards = {
        // Initialize the module
        init: function() {
            this.loadFeaturedProperties();
            this.loadTopAgents();
            this.loadBlogPosts();
        },

        // Load featured properties
        loadFeaturedProperties: function() {
            const container = document.getElementById('featuredProperties');
            if (container) {
                const html = SAMPLE_PROPERTIES.map(property => createPropertyCard(property)).join('');
                container.innerHTML = html;
                
                // Re-initialize lucide icons
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        },

        // Load top agents
        loadTopAgents: function() {
            const container = document.getElementById('topAgents');
            if (container) {
                const html = SAMPLE_AGENTS.map(agent => createTeamMemberCard(agent)).join('');
                container.innerHTML = html;
                
                // Re-initialize lucide icons
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        },

        // Load blog posts
        loadBlogPosts: function() {
            const container = document.getElementById('latestBlogPosts');
            if (container) {
                const html = SAMPLE_BLOG_POSTS.map(post => createBlogCard(post)).join('');
                container.innerHTML = html;
                
                // Re-initialize lucide icons
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        },

        // Event handlers
        handleViewDetails: function(id) {
            console.log('View property:', id);
            if (window.TemerUtils) {
                window.TemerUtils.showToast('Property details would open here', 'info');
            }
            // In a real app, navigate to property details page
            // window.location.href = `./pages/property-details.html?id=${id}`;
        },

        handleFavorite: function(id) {
            console.log('Favorite property:', id);
            if (window.TemerUtils) {
                window.TemerUtils.showToast('Property added to favorites!', 'success');
            }
        },

        handleShare: function(id) {
            console.log('Share property:', id);
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this property',
                    text: 'I found this amazing property on Temer Properties',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    if (window.TemerUtils) {
                        window.TemerUtils.showToast('Property link copied to clipboard!', 'success');
                    }
                });
            }
        },

        handleCall: function(phoneOrId) {
            console.log('Call clicked for property:', phoneOrId);
            const phone = phoneOrId.startsWith('+') ? phoneOrId : '+1 (555) 123-4567';
            const cleanPhone = window.TemerUtils ? window.TemerUtils.formatPhoneForCall(phone) : phone;
            window.location.href = `tel:${cleanPhone}`;
        },

        handleWhatsApp: function(phoneOrId) {
            console.log('WhatsApp clicked for property:', phoneOrId);
            const phone = phoneOrId.startsWith('+') ? phoneOrId : '+1 (555) 123-4567';
            const message = 'Hi! I\'m interested in learning more about this property from Temer Properties.';
            const whatsappUrl = window.TemerUtils ? 
                window.TemerUtils.generateWhatsAppUrl(phone, message) :
                `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },

        handleEmail: function(email) {
            const subject = 'Inquiry about Properties - Temer Properties';
            const body = 'Hi,\n\nI\'m interested in learning more about your real estate services.\n\nBest regards';
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        },

        handleReadMore: function(id) {
            console.log('Read more blog post:', id);
            if (window.TemerUtils) {
                window.TemerUtils.showToast('Blog post would open here', 'info');
            }
            // In a real app, navigate to blog post
            // window.location.href = `./pages/blog-post.html?id=${id}`;
        }
    };

})();