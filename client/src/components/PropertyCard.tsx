import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, Share2, Phone, MessageCircle } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  status: 'sale' | 'rent' | 'sold';
  featured?: boolean;
  onViewDetails: (id: string) => void;
  onFavorite: (id: string) => void;
  onShare: (id: string) => void;
  onCall: (id: string) => void;
  onWhatsApp: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  beds,
  baths,
  sqft,
  image,
  status,
  featured = false,
  onViewDetails,
  onFavorite,
  onShare,
  onCall,
  onWhatsApp
}: PropertyCardProps) {
  
  const handleViewDetails = () => {
    console.log('View details clicked for property:', id);
    onViewDetails(id);
  };

  const handleFavorite = () => {
    console.log('Favorite clicked for property:', id);
    onFavorite(id);
  };

  const handleShare = () => {
    console.log('Share clicked for property:', id);
    onShare(id);
  };

  const handleCall = () => {
    console.log('Call clicked for property:', id);
    onCall(id);
  };

  const handleWhatsApp = () => {
    console.log('WhatsApp clicked for property:', id);
    onWhatsApp(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sale': return 'bg-primary text-primary-foreground';
      case 'rent': return 'bg-blue-600 text-white';
      case 'sold': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sale': return 'For Sale';
      case 'rent': return 'For Rent';
      case 'sold': return 'Sold';
      default: return status;
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate cursor-pointer group" data-testid={`card-property-${id}`}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </Badge>
        
        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white text-gray-700 w-8 h-8"
            onClick={handleFavorite}
            data-testid={`button-favorite-${id}`}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white text-gray-700 w-8 h-8"
            onClick={handleShare}
            data-testid={`button-share-${id}`}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-lg text-gray-900">
            {price}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1" data-testid={`text-title-${id}`}>
          {title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm" data-testid={`text-location-${id}`}>{location}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span data-testid={`text-beds-${id}`}>{beds} bed{beds !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span data-testid={`text-baths-${id}`}>{baths} bath{baths !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span data-testid={`text-sqft-${id}`}>{sqft} sq ft</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleCall}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              data-testid={`button-call-${id}`}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              data-testid={`button-whatsapp-${id}`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>
          
          <Button 
            onClick={handleViewDetails} 
            className="w-full" 
            variant="outline"
            data-testid={`button-view-details-${id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}