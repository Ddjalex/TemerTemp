import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MessageCircle, Star } from "lucide-react";

interface TeamMemberCardProps {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
  salesCount: number;
  onCall: (phone: string) => void;
  onEmail: (email: string) => void;
  onMessage: (id: string) => void;
}

export default function TeamMemberCard({
  id,
  name,
  role,
  photo,
  phone,
  email,
  specialties,
  rating,
  salesCount,
  onCall,
  onEmail,
  onMessage
}: TeamMemberCardProps) {

  const handleCall = () => {
    console.log('Call clicked for:', name);
    onCall(phone);
  };

  const handleEmail = () => {
    console.log('Email clicked for:', name);
    onEmail(email);
  };

  const handleMessage = () => {
    console.log('Message clicked for:', name);
    onMessage(id);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-team-member-${id}`}>
      <CardContent className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-heading font-semibold text-xl mb-1" data-testid={`text-name-${id}`}>
            {name}
          </h3>
          
          <p className="text-muted-foreground mb-3" data-testid={`text-role-${id}`}>
            {role}
          </p>
          
          {/* Rating & Sales */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium" data-testid={`text-rating-${id}`}>{rating}</span>
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium" data-testid={`text-sales-${id}`}>{salesCount}</span> sales
            </div>
          </div>
          
          {/* Specialties */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex items-center gap-2"
              data-testid={`button-call-${id}`}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmail}
              className="flex items-center gap-2"
              data-testid={`button-email-${id}`}
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
          
          <Button
            onClick={handleMessage}
            className="w-full bg-primary hover:bg-primary/90"
            data-testid={`button-message-${id}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
        
        {/* Contact Info */}
        <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span data-testid={`text-phone-${id}`}>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="truncate" data-testid={`text-email-${id}`}>{email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}