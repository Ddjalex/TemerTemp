import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar, 
  Home, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react";
import { getProperty, getPublicSettings } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: propertyData, isLoading: isLoadingProperty, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
    enabled: !!id
  });

  const { data: settingsData } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getPublicSettings
  });

  const property = propertyData?.data;
  const adminSettings = settingsData?.data || {};

  const handleCall = () => {
    const adminPhone = adminSettings?.contact?.contact_phone || '+1 (555) 123-4567';
    const cleanPhone = adminPhone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsApp = () => {
    const adminWhatsApp = adminSettings?.contact?.contact_whatsapp || '+1 (555) 123-4567';
    const propertyTitle = property ? property.title : 'this property';
    const propertyUrl = window.location.href;
    
    const message = `Hi! I'm interested in ${propertyTitle} from Temer Properties. Could you provide more information? Property link: ${propertyUrl}`;
    const phone = adminWhatsApp.replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    // This could be implemented with local storage or user accounts
    console.log('Add to favorites:', id);
    alert('Added to favorites!');
  };

  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6 w-48"></div>
            <div className="h-96 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4 w-2/3"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/listings')}
            className="mb-6"
            data-testid="button-back-to-listings"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation('/listings')}>
              View All Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'for-sale': return 'bg-primary text-primary-foreground';
      case 'for-rent': return 'bg-blue-600 text-white';
      case 'sold': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'for-sale': return 'For Sale';
      case 'for-rent': return 'For Rent';
      case 'sold': return 'Sold';
      default: return status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Available';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setLocation('/listings')}
          className="mb-6"
          data-testid="button-back-to-listings"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        {/* Property Images */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-96 object-cover"
              data-testid="img-property-main"
            />
            
            {/* Status Badge */}
            <Badge className={`absolute top-4 left-4 ${getStatusColor(property.status)}`}>
              {getStatusText(property.status)}
            </Badge>
            
            {/* Featured Badge */}
            {property.isFeatured && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Additional Images */}
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {property.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${property.title} - ${index + 2}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-2" data-testid="text-property-title">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span data-testid="text-property-location">
                  {property.address?.street && `${property.address.street}, `}
                  {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                </span>
              </div>
              <div className="text-3xl font-bold text-primary" data-testid="text-property-price">
                {formatCurrency(property.price)}
                {property.status === 'for-rent' && <span className="text-lg font-normal">/month</span>}
              </div>
            </div>

            {/* Property Features */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center" data-testid="feature-bedrooms">
                    <Bed className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">{property.features?.bedrooms || 0}</span>
                    <span className="text-sm text-muted-foreground ml-1">Beds</span>
                  </div>
                  <div className="flex items-center" data-testid="feature-bathrooms">
                    <Bath className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">{property.features?.bathrooms || 0}</span>
                    <span className="text-sm text-muted-foreground ml-1">Baths</span>
                  </div>
                  <div className="flex items-center" data-testid="feature-sqft">
                    <Square className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">{(property.features?.sqft || 0).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">sq ft</span>
                  </div>
                  {property.features?.garage && (
                    <div className="flex items-center" data-testid="feature-garage">
                      <Car className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="font-medium">{property.features.garage}</span>
                      <span className="text-sm text-muted-foreground ml-1">Garage</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="prose prose-sm max-w-none" data-testid="text-property-description">
                  {property.description ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No description available for this property.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Property Type</span>
                    <p className="font-medium" data-testid="detail-property-type">
                      {property.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Year Built</span>
                    <p className="font-medium" data-testid="detail-year-built">
                      {property.features?.yearBuilt || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Lot Size</span>
                    <p className="font-medium" data-testid="detail-lot-size">
                      {property.features?.lotSize ? `${property.features.lotSize} acres` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <p className="font-medium" data-testid="detail-updated">
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleCall} 
                    className="w-full"
                    data-testid="button-call"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button 
                    onClick={handleWhatsApp} 
                    variant="outline" 
                    className="w-full"
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Separator />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleFavorite} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      data-testid="button-favorite"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      onClick={handleShare} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      data-testid="button-share"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{formatCurrency(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(property.status)} variant="secondary">
                      {getStatusText(property.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms</span>
                    <span className="font-medium">{property.features?.bedrooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms</span>
                    <span className="font-medium">{property.features?.bathrooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet</span>
                    <span className="font-medium">{(property.features?.sqft || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}