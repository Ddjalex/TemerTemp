import { useState, useEffect } from "react";
import TeamMemberCard from "@/components/TeamMemberCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Star, TrendingUp, Phone, Mail, MessageCircle } from "lucide-react";

// Import generated images as fallbacks
import agentPhoto1 from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";
import agentPhoto2 from "@assets/generated_images/Male_agent_portrait_8ad97304.png";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error('Failed to fetch team members');
      
      const data = await response.json();
      setTeamMembers(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Normalize API data to match UI expectations
  const normalizeTeamMember = (member) => ({
    id: member._id,
    name: member.name,
    role: member.role || member.position || "Real Estate Agent",
    photo: member.image?.url || member.photo || agentPhoto1, // Use fallback images for missing photos
    phone: member.phone || member.contact?.phone,
    email: member.email || member.contact?.email,
    specialties: member.specialties || member.skills || [],
    rating: member.rating || 5.0,
    salesCount: member.salesCount || member.propertiesSold || 0
  });

  const normalizedTeamMembers = teamMembers.map(normalizeTeamMember);

  const teamStats = [
    { icon: Users, label: "Team Members", value: "12+", description: "Experienced professionals" },
    { icon: Star, label: "Average Rating", value: "4.8", description: "Client satisfaction" },
    { icon: Award, label: "Years Combined", value: "85+", description: "Industry experience" },
    { icon: TrendingUp, label: "Sales Volume", value: "ETB 12.5B+", description: "Lifetime sales" }
  ];

  const handleCall = (phone) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMessage = (id) => {
    console.log("Message agent:", id);
    // In a real app, this would open a contact form or messaging system
  };


  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading our team...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Team</h1>
            <p className="text-red-600 mb-4">Error loading team members: {error}</p>
            <Button onClick={fetchTeamMembers}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Team
          </Badge>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-6">
            Meet Our Expert Agents
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Our experienced team of licensed real estate professionals is dedicated to providing exceptional service and helping you achieve your property goals. With deep local market knowledge and a commitment to excellence, we're here to guide you every step of the way.
          </p>
        </div>
      </div>

      {/* Team Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {teamStats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover-elevate">
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {normalizedTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {normalizedTeamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  {...member}
                  onCall={handleCall}
                  onEmail={handleEmail}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No Team Members Yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Our team section is being updated. Please check back soon to meet our amazing real estate professionals, or contact us directly for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/listings">View Properties</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Ready to Work with Our Team?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Our agents are ready to help you buy, sell, or rent your next property. Contact us today to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-md font-medium transition-colors">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md font-medium transition-colors">
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}