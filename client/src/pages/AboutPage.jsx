import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Award, 
  TrendingUp, 
  Home, 
  Star,
  Phone,
  Mail,
  Building,
  Calendar,
  Target,
  Heart
} from 'lucide-react';

export default function AboutPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/properties/stats/overview');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const companyValues = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize our clients' needs and dreams above all else, ensuring personalized service for every property journey."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in all our services, from property selection to transaction completion."
    },
    {
      icon: Target,
      title: "Transparency",
      description: "Clear communication and honest dealings form the foundation of our client relationships."
    },
    {
      icon: Users,
      title: "Community",
      description: "We're not just selling properties; we're building communities and helping families find their perfect homes."
    }
  ];

  const services = [
    {
      icon: Home,
      title: "Property Sales",
      description: "Expert assistance in buying and selling residential and commercial properties."
    },
    {
      icon: Building,
      title: "Property Management",
      description: "Comprehensive management services for rental properties and investments."
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Professional guidance on real estate investment opportunities and market analysis."
    },
    {
      icon: MapPin,
      title: "Location Scouting",
      description: "Help you find the perfect location based on your lifestyle and business needs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">Temer Properties</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in Ethiopian real estate, committed to helping you find the perfect property 
            for your needs. With years of experience and deep local market knowledge, we make property 
            transactions smooth and successful.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {!loading && stats && (
        <div className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stats.total || 0}
                </div>
                <div className="text-muted-foreground font-medium">Total Properties</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stats.available || 0}
                </div>
                <div className="text-muted-foreground font-medium">Available Now</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stats.sold || 0}
                </div>
                <div className="text-muted-foreground font-medium">Sold Properties</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
                <div className="text-muted-foreground font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Our Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded with a vision to transform the Ethiopian real estate landscape, Temer Properties 
                  has grown from a small local agency to a trusted name in property services across the region.
                </p>
                <p>
                  We understand that buying or selling property is one of life's most significant decisions. 
                  That's why we've built our reputation on trust, expertise, and unwavering commitment to 
                  our clients' success.
                </p>
                <p>
                  Our team combines deep local market knowledge with modern technology to deliver exceptional 
                  service. Whether you're a first-time buyer, seasoned investor, or looking to sell, we're 
                  here to guide you every step of the way.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    Established
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Founded in 2019 with a mission to provide transparent and reliable real estate services.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    Our Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Serving clients across major Ethiopian cities with plans to expand our coverage area.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Our Services */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or investing, our team is here to help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <a href="/contact">Get in Touch</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <a href="/listings">View Properties</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}