import { useState } from 'react';
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

// Import generated images
import luxuryVilla from "@assets/generated_images/Luxury_villa_hero_image_3dfce514.png";
import modernHome from "@assets/generated_images/Modern_family_home_600a02bb.png";
import luxuryCondo from "@assets/generated_images/Downtown_luxury_condo_15b7acf1.png";
import modernInterior from "@assets/generated_images/Modern_apartment_interior_61087e44.png";

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  //todo: remove mock functionality
  const properties = [
    {
      id: "1",
      title: "Luxury Villa with Ocean View",
      price: "$2,850,000",
      location: "Miami Beach, FL",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      image: luxuryVilla,
      status: "sale" as const,
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
      image: modernHome,
      status: "sale" as const,
      featured: false
    },
    {
      id: "3",
      title: "Downtown Luxury Condominium",
      price: "$1,250,000",
      location: "Downtown Miami, FL",
      beds: 3,
      baths: 2,
      sqft: "2,400",
      image: luxuryCondo,
      status: "rent" as const,
      featured: true
    },
    {
      id: "4",
      title: "Spacious Modern Apartment",
      price: "$3,200/month",
      location: "Brickell, FL",
      beds: 2,
      baths: 2,
      sqft: "1,800",
      image: modernInterior,
      status: "rent" as const,
      featured: false
    },
    {
      id: "5",
      title: "Waterfront Luxury Villa",
      price: "$4,950,000",
      location: "Key Biscayne, FL",
      beds: 6,
      baths: 5,
      sqft: "5,500",
      image: luxuryVilla,
      status: "sale" as const,
      featured: true
    },
    {
      id: "6",
      title: "Contemporary Townhouse",
      price: "$695,000",
      location: "Aventura, FL",
      beds: 3,
      baths: 3,
      sqft: "2,100",
      image: modernHome,
      status: "sale" as const,
      featured: false
    }
  ];

  const totalPages = Math.ceil(properties.length / 6);
  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const currentProperties = properties.slice(startIndex, endIndex);

  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
    // In real app, this would filter the properties
  };

  const handleFilterReset = () => {
    console.log('Filters reset');
    // In real app, this would reset all filters
  };

  const handleViewDetails = (id: string) => console.log("View property:", id);
  const handleFavorite = (id: string) => console.log("Favorite property:", id);
  const handleShare = (id: string) => console.log("Share property:", id);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    console.log('Sort by:', value);
  };

  const handlePageChange = (page: number) => {
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
                  {properties.length} properties found
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, properties.length)} of {properties.length}
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
              {currentProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onViewDetails={handleViewDetails}
                  onFavorite={handleFavorite}
                  onShare={handleShare}
                />
              ))}
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