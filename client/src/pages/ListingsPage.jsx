import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { getProperties, getPublicSettings } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";

// Import generated images
import luxuryVilla from "@assets/generated_images/Luxury_villa_hero_image_3dfce514.png";
import modernHome from "@assets/generated_images/Modern_family_home_600a02bb.png";
import luxuryCondo from "@assets/generated_images/Downtown_luxury_condo_15b7acf1.png";
import modernInterior from "@assets/generated_images/Modern_apartment_interior_61087e44.png";

export default function ListingsPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    status: '',
    priceRange: [0, 250000000],
    bedrooms: '',
    bathrooms: '',
    sqftRange: [0, 10000]
  });

  // Convert frontend filters to backend API parameters
  const getAPIParams = () => {
    const params = {
      page: currentPage,
      limit: 12,
      sort: sortBy === 'newest' ? '-createdAt' : 
             sortBy === 'price-low' ? 'price' :
             sortBy === 'price-high' ? '-price' :
             sortBy === 'beds' ? '-features.bedrooms' :
             sortBy === 'sqft' ? '-features.sqft' : '-createdAt'
    };

    // Map frontend status to backend format
    if (filters.status) {
      if (filters.status === 'sale') params.status = 'for-sale';
      else if (filters.status === 'rent') params.status = 'for-rent';
      else params.status = filters.status;
    }

    // Map property type
    if (filters.propertyType) {
      params.type = filters.propertyType;
    }

    // Handle location - split into city for now (could be enhanced)
    if (filters.location) {
      params.city = filters.location;
    }

    // Handle price range
    if (filters.priceRange[0] > 0) {
      params.minPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1] < 250000000) {
      params.maxPrice = filters.priceRange[1];
    }

    // Handle bedrooms/bathrooms
    if (filters.bedrooms) {
      params.bedrooms = filters.bedrooms;
    }
    if (filters.bathrooms) {
      params.bathrooms = filters.bathrooms;
    }

    return params;
  };

  // Fetch properties from API with filters
  const apiParams = getAPIParams();
  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', apiParams],
    queryFn: () => getProperties(apiParams)
  });

  const { data: settingsData } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getPublicSettings
  });

  // Handle both paginated response format and direct array format
  const propertiesArray = propertiesData?.data?.properties || propertiesData?.data || [];
  const properties = Array.isArray(propertiesArray) ? propertiesArray.map(property => ({
    id: property._id,
    title: property.title,
    price: formatCurrency(property.price),
    location: `${property.address?.city || 'N/A'}, ${property.address?.state || 'N/A'}`,
    beds: property.features?.bedrooms || 0,
    baths: property.features?.bathrooms || 0,
    sqft: (property.features?.sqft || 0).toLocaleString(),
    image: property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url || modernInterior,
    status: property.status === 'for-sale' ? 'sale' : property.status,
    featured: property.isFeatured
  })) : [];
  
  const adminSettings = settingsData?.data || {};

  // Use server-side pagination if available, otherwise fall back to client-side
  const pagination = propertiesData?.data?.pagination;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.itemsPerPage) : Math.ceil(properties.length / 6);
  
  // If server provides pagination, use all properties directly, otherwise slice for client-side pagination
  const currentProperties = pagination ? properties : properties.slice((currentPage - 1) * 6, currentPage * 6);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log('Filters applied:', newFilters);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      location: '',
      propertyType: '',
      status: '',
      priceRange: [0, 250000000],
      bedrooms: '',
      bathrooms: '',
      sqftRange: [0, 10000]
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    console.log('Filters reset');
  };

  const handleViewDetails = (id) => {
    console.log("View property:", id);
    setLocation(`/property/${id}`);
  };
  const handleFavorite = (id) => console.log("Favorite property:", id);
  const handleShare = (id) => console.log("Share property:", id);
  const handleCall = (id) => {
    const adminPhone = adminSettings?.contact?.contact_phone || '+1 (555) 123-4567';
    const cleanPhone = adminPhone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };
  const handleWhatsApp = (id) => {
    const adminWhatsApp = adminSettings?.contact?.contact_whatsapp || '+1 (555) 123-4567';
    const property = properties.find(p => p.id === id);
    const propertyTitle = property ? property.title : 'this property';
    const propertyUrl = `${window.location.origin}/property/${id}`;
    
    const message = `Hi! I'm interested in ${propertyTitle} from Temer Properties. Could you provide more information? Property link: ${propertyUrl}`;
    const phone = adminWhatsApp.replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
    console.log('Sort by:', value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Property Listings
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover your perfect property from our extensive collection of homes, condos, and commercial spaces.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {pagination ? pagination.total : properties.length} properties found
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {pagination ? 
                    `Showing ${pagination.itemsFrom}-${pagination.itemsTo} of ${pagination.total}` :
                    `Showing ${(currentPage - 1) * 6 + 1}-${Math.min(currentPage * 6, properties.length)} of ${properties.length}`
                  }
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-40" data-testid="select-sort-by">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="beds">Most Bedrooms</SelectItem>
                      <SelectItem value="sqft">Largest Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    data-testid="button-view-grid"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    data-testid="button-view-list"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {isLoadingProperties ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-64 mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))
              ) : properties.length > 0 ? (
                currentProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    onViewDetails={handleViewDetails}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                    onCall={handleCall}
                    onWhatsApp={handleWhatsApp}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No properties available at the moment. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}