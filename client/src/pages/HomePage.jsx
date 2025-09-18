import { useQuery } from '@tanstack/react-query';
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, Users, Home, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { getFeaturedProperties, getTeamMembers, getBlogPosts, getPropertyStats } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";

// Fallback images
import modernInterior from "@assets/generated_images/Modern_apartment_interior_61087e44.png";
import agentPhoto1 from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";
import agentPhoto2 from "@assets/generated_images/Male_agent_portrait_8ad97304.png";

export default function HomePage() {
  // Fetch data from API
  const { data: featuredData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => getFeaturedProperties(3)
  });

  const { data: teamData, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers
  });

  const { data: blogData, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => getBlogPosts(2)
  });

  const { data: statsData } = useQuery({
    queryKey: ['property-stats'],
    queryFn: getPropertyStats
  });

  const featuredProperties = featuredData?.data || [];
  const teamMembers = teamData?.data || [];
  const blogPosts = blogData?.data?.posts || [];

  // Default stats with API data overlay
  const stats = [
    { 
      icon: Home, 
      label: "Properties Sold", 
      value: statsData?.data?.sold ? `${statsData.data.sold}+` : "1,200+", 
      description: "This year" 
    },
    { 
      icon: Users, 
      label: "Happy Clients", 
      value: "850+", 
      description: "Satisfied customers" 
    },
    { 
      icon: Award, 
      label: "Years Experience", 
      value: "15+", 
      description: "In real estate" 
    },
    { 
      icon: TrendingUp, 
      label: "Properties Available", 
      value: statsData?.data?.totalProperties ? `${statsData.data.totalProperties}+` : "150+", 
      description: "Active listings" 
    }
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
            {isLoadingProperties ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))
            ) : (
              featuredProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  id={property._id}
                  title={property.title}
                  price={formatCurrency(property.price)}
                  location={`${property.address.city}, ${property.address.state}`}
                  beds={property.features.bedrooms}
                  baths={property.features.bathrooms}
                  sqft={property.features.sqft}
                  image={property.images?.[0]?.url || modernInterior}
                  status={property.status}
                  featured={property.isFeatured}
                  onViewDetails={handleViewDetails}
                  onFavorite={handleFavorite}
                  onShare={handleShare}
                  onCall={handleCall}
                  onWhatsApp={handleWhatsApp}
                />
              ))
            )}
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
            {isLoadingTeam ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-80 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))
            ) : (
              teamMembers.slice(0, 2).map((member) => (
                <TeamMemberCard
                  key={member._id}
                  id={member._id}
                  name={`${member.firstName} ${member.lastName}`}
                  role={member.position}
                  photo={member.photo?.url || (member.firstName === 'Sarah' ? agentPhoto1 : agentPhoto2)}
                  phone={member.contact?.phone || '+1 (555) 123-4567'}
                  email={member.contact?.email || `${member.firstName.toLowerCase()}@temerproperties.com`}
                  specialties={member.specialties || ['Real Estate', 'Sales']}
                  rating={member.rating || 4.8}
                  salesCount={member.propertyCount || 0}
                  onCall={handleAgentCall}
                  onEmail={handleEmail}
                  onMessage={handleMessage}
                />
              ))
            )}
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
            {isLoadingBlog ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <BlogCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  excerpt={post.excerpt || post.content?.substring(0, 150) + '...'}
                  coverImage={post.featuredImage?.url || modernInterior}
                  author={{
                    name: post.author?.firstName ? `${post.author.firstName} ${post.author.lastName}` : 'Team Writer',
                    avatar: agentPhoto1
                  }}
                  publishDate={new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  readTime={`${Math.ceil((post.content?.length || 500) / 200)} min read`}
                  category={post.category || 'Real Estate'}
                  onReadMore={handleReadMore}
                />
              ))
            ) : (
              // Fallback content when no blog posts
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Blog posts coming soon!</p>
              </div>
            )}
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