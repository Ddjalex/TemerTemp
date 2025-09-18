import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, Users, Home, TrendingUp } from "lucide-react";
import { Link } from "wouter";

// Import generated images
import luxuryVilla from "@assets/generated_images/Luxury_villa_hero_image_3dfce514.png";
import modernHome from "@assets/generated_images/Modern_family_home_600a02bb.png";
import luxuryCondo from "@assets/generated_images/Downtown_luxury_condo_15b7acf1.png";
import modernInterior from "@assets/generated_images/Modern_apartment_interior_61087e44.png";
import agentPhoto1 from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";
import agentPhoto2 from "@assets/generated_images/Male_agent_portrait_8ad97304.png";

export default function HomePage() {
  //todo: remove mock functionality
  const featuredProperties = [
    {
      id: "1",
      title: "Luxury Villa with Ocean View",
      price: "ETB 142,500,000",
      location: "Miami Beach, FL",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      image: luxuryVilla,
      status: "sale",
      featured: true
    },
    {
      id: "2", 
      title: "Modern Family Home",
      price: "ETB 43,750,000",
      location: "Coral Gables, FL",
      beds: 4,
      baths: 3,
      sqft: "3,100",
      image: modernHome,
      status: "sale",
      featured: true
    },
    {
      id: "3",
      title: "Downtown Luxury Condominium", 
      price: "ETB 62,500,000",
      location: "Downtown Miami, FL",
      beds: 3,
      baths: 2,
      sqft: "2,400",
      image: luxuryCondo,
      status: "sale",
      featured: true
    }
  ];

  const topAgents = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Real Estate Agent", 
      photo: agentPhoto1,
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
      photo: agentPhoto2, 
      phone: "+1 (555) 234-5678",
      email: "michael.chen@temerproperties.com",
      specialties: ["First-Time Buyers", "Condos", "Commercial"],
      rating: 4.9,
      salesCount: 98
    }
  ];

  const blogPosts = [
    {
      id: "1",
      title: "2024 Real Estate Market Trends: What Buyers Need to Know",
      excerpt: "Discover the latest trends shaping the real estate market this year, from pricing fluctuations to emerging neighborhoods and investment opportunities.",
      coverImage: modernInterior,
      author: {
        name: "Sarah Johnson",
        avatar: agentPhoto1
      },
      publishDate: "Mar 15, 2024",
      readTime: "5 min read", 
      category: "Market Insights"
    },
    {
      id: "2",
      title: "First-Time Home Buyer's Complete Guide",
      excerpt: "Everything you need to know about purchasing your first home, from mortgage pre-approval to closing day.",
      coverImage: modernHome,
      author: {
        name: "Michael Chen", 
        avatar: agentPhoto2
      },
      publishDate: "Mar 12, 2024",
      readTime: "7 min read",
      category: "Buying Guide"
    }
  ];

  const stats = [
    { icon: Home, label: "Properties Sold", value: "1,200+", description: "This year" },
    { icon: Users, label: "Happy Clients", value: "850+", description: "Satisfied customers" },
    { icon: Award, label: "Years Experience", value: "15+", description: "In real estate" },
    { icon: TrendingUp, label: "Market Growth", value: "18%", description: "Year over year" }
  ];

  // Mock handlers
  const handleViewDetails = (id) => console.log("View property:", id);
  const handleFavorite = (id) => console.log("Favorite property:", id);
  const handleShare = (id) => console.log("Share property:", id);
  const handleCall = (id) => console.log("Call property:", id);
  const handleWhatsApp = (id) => console.log("WhatsApp property:", id);
  const handleAgentCall = (phone) => console.log("Call:", phone);
  const handleEmail = (email) => console.log("Email:", email);
  const handleMessage = (id) => console.log("Message agent:", id);
  const handleReadMore = (id) => console.log("Read blog post:", id);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Featured Properties
            </Badge>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Discover Your Dream Home
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated selection of premium properties, each offering exceptional value and unique features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onViewDetails={handleViewDetails}
                onFavorite={handleFavorite}
                onShare={handleShare}
                onCall={handleCall}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" data-testid="button-view-all-properties">
              <Link href="/listings">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Why Choose Temer Properties
            </Badge>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Your Success is Our Priority
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With over 15 years of experience, we provide unmatched expertise and personalized service to help you achieve your real estate goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Our licensed professionals provide expert advice and guidance throughout your real estate journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">Personalized Service</h3>
                <p className="text-muted-foreground">
                  We tailor our approach to your unique needs, ensuring a personalized experience from start to finish.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">Market Expertise</h3>
                <p className="text-muted-foreground">
                  Deep knowledge of local markets helps us find the best opportunities and negotiate the best deals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Team
            </Badge>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Meet Our Expert Agents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced team of real estate professionals is dedicated to helping you find your perfect property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {topAgents.map((agent) => (
              <TeamMemberCard
                key={agent.id}
                {...agent}
                onCall={handleAgentCall}
                onEmail={handleEmail}
                onMessage={handleMessage}
              />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" data-testid="button-view-all-team">
              <Link href="/team">
                View Our Full Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Latest Insights
            </Badge>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Real Estate News & Tips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest market trends, buying tips, and industry insights from our experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                {...post}
                onReadMore={handleReadMore}
              />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" data-testid="button-view-all-blog">
              <Link href="/blog">
                Read More Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let our expert team help you navigate the real estate market and find the perfect property for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              data-testid="button-cta-browse"
            >
              <Link href="/listings">Browse Properties</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-cta-contact"
            >
              <Link href="/contact">Contact an Agent</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}