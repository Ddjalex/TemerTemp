import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";

export default function PropertyFilters({ onFilterChange, onReset }) {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    status: '',
    priceRange: [0, 5000000],
    bedrooms: '',
    bathrooms: '',
    sqftRange: [0, 10000]
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      propertyType: '',
      status: '',
      priceRange: [0, 5000000],
      bedrooms: '',
      bathrooms: '',
      sqftRange: [0, 10000]
    };
    setFilters(resetFilters);
    onReset();
    console.log('Filters reset');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.propertyType) count++;
    if (filters.status) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) count++;
    if (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 10000) count++;
    return count;
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  const formatSqft = (sqft) => {
    if (sqft >= 1000) {
      return `${(sqft / 1000).toFixed(1)}K`;
    }
    return `${sqft}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Properties
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-destructive hover:text-destructive"
              data-testid="button-reset-filters"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
              data-testid="button-toggle-filters"
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Quick Search */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Enter city, neighborhood, or ZIP"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="pl-10"
              data-testid="input-filter-location"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
            <SelectTrigger data-testid="select-filter-property-type">
              <SelectValue placeholder="All property types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condominium</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger data-testid="select-filter-status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="sold">Recently Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={5000000}
              min={0}
              step={50000}
              className="w-full"
              data-testid="slider-price-range"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span data-testid="text-price-min">{formatPrice(filters.priceRange[0])}</span>
            <span data-testid="text-price-max">{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
            <SelectTrigger data-testid="select-filter-bedrooms">
              <SelectValue placeholder="Any bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
            <SelectTrigger data-testid="select-filter-bathrooms">
              <SelectValue placeholder="Any bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Square Footage */}
        <div className="space-y-3">
          <Label>Square Footage</Label>
          <div className="px-2">
            <Slider
              value={filters.sqftRange}
              onValueChange={(value) => updateFilter('sqftRange', value)}
              max={10000}
              min={0}
              step={100}
              className="w-full"
              data-testid="slider-sqft-range"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span data-testid="text-sqft-min">{formatSqft(filters.sqftRange[0])} sq ft</span>
            <span data-testid="text-sqft-max">{formatSqft(filters.sqftRange[1])} sq ft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}