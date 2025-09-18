import PropertyCard from '../PropertyCard';
import luxuryVilla from "@assets/generated_images/Luxury_villa_hero_image_3dfce514.png";

export default function PropertyCardExample() {
  //todo: remove mock functionality
  const handleViewDetails = (id) => console.log('View details:', id);
  const handleFavorite = (id) => console.log('Favorite:', id);
  const handleShare = (id) => console.log('Share:', id);
  const handleCall = (id) => console.log('Call:', id);
  const handleWhatsApp = (id) => console.log('WhatsApp:', id);

  return (
    <div className="p-6 max-w-sm">
      <PropertyCard
        id="1"
        title="Luxury Villa with Ocean View"
        price="$2,850,000"
        location="Miami Beach, FL"
        beds={5}
        baths={4}
        sqft="4,200"
        image={luxuryVilla}
        status="sale"
        featured={true}
        onViewDetails={handleViewDetails}
        onFavorite={handleFavorite}
        onShare={handleShare}
        onCall={handleCall}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  );
}