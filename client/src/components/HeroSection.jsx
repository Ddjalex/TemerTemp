import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getHeroSlides } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import luxuryVilla from "@assets/generated_images/Luxury_villa_hero_image_3dfce514.png";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Fetch hero slides from API
  const { data: heroData, isLoading, error } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: getHeroSlides
  });

  const slides = heroData?.data || [];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = () => {
    console.log('Search triggered:', { searchLocation, propertyType, priceRange });
  };

  if (isLoading) {
    return (
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading hero slides...</p>
        </div>
      </section>
    );
  }

  if (error || !slides.length) {
    // Fallback to default slide
    const defaultSlide = {
      _id: 'default',
      title: 'Luxury Properties Available',
      subtitle: 'Find your perfect home today',
      image: { url: luxuryVilla, alt: 'Luxury Villa' },
      property: {
        price: 50000000,
        address: { city: 'Addis Ababa', state: 'Ethiopia' },
        features: { bedrooms: 4, bathrooms: 3, sqft: 3500 }
      }
    };
    setCurrentSlide(0);
    return renderHeroSlide(defaultSlide);
  }

  const current = slides[currentSlide];

  function renderHeroSlide(slide) {
    const property = slide.property || {};
    const features = property.features || {};
    const address = property.address || {};
    
    return (
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={slide.image?.url || luxuryVilla}
            alt={slide.image?.alt || slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl text-white">
              <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-xl lg:text-2xl mb-2 font-light">
                {slide.subtitle}
              </p>
              
              {/* Property Details */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-lg">
                <span className="font-bold text-2xl text-primary">
                  {property.price ? formatCurrency(property.price) : 'Price Available'}
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{address.city ? `${address.city}, ${address.state}` : 'Location Available'}</span>
                </div>
                {features.bedrooms && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-5 h-5" />
                      <span>{features.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-5 h-5" />
                      <span>{features.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-5 h-5" />
                      <span>{features.sqft} sq ft</span>
                    </div>
                  </div>
                )}
              </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                data-testid="button-view-details"
              >
                View Details
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                data-testid="button-schedule-tour"
              >
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={prevSlide}
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={nextSlide}
        data-testid="button-next-slide"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-primary' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
            data-testid={`button-slide-${index}`}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  placeholder="Enter city or area"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  data-testid="input-search-location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger data-testid="select-property-type">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger data-testid="select-price-range">
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-25000000">Under ETB 25M</SelectItem>
                    <SelectItem value="25000000-50000000">ETB 25M - 50M</SelectItem>
                    <SelectItem value="50000000-100000000">ETB 50M - 100M</SelectItem>
                    <SelectItem value="100000000+">ETB 100M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  className="w-full bg-primary hover:bg-primary/90"
                  data-testid="button-search-properties"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    );
  }

  return renderHeroSlide(current);
}