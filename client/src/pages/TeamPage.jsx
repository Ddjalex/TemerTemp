import TeamMemberCard from "@/components/TeamMemberCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Star, TrendingUp } from "lucide-react";

// Import generated images
import agentPhoto1 from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";
import agentPhoto2 from "@assets/generated_images/Male_agent_portrait_8ad97304.png";

export default function TeamPage() {
  //todo: remove mock functionality
  const teamMembers = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Real Estate Agent & Team Lead",
      photo: agentPhoto1,
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@temerproperties.com",
      specialties: ["Luxury Homes", "Waterfront Properties", "Investment Properties"],
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
      specialties: ["First-Time Buyers", "Condominiums", "Commercial Properties"],
      rating: 4.9,
      salesCount: 98
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Property Consultant",
      photo: agentPhoto1,
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@temerproperties.com",
      specialties: ["Rental Properties", "Property Management", "Relocation Services"],
      rating: 4.7,
      salesCount: 156
    },
    {
      id: "4",
      name: "David Thompson",
      role: "Investment Advisor",
      photo: agentPhoto2,
      phone: "+1 (555) 456-7890",
      email: "david.thompson@temerproperties.com",
      specialties: ["Investment Analysis", "Commercial Real Estate", "Portfolio Management"],
      rating: 4.9,
      salesCount: 89
    },
    {
      id: "5",
      name: "Maria Gonzalez",
      role: "Luxury Home Specialist",
      photo: agentPhoto1,
      phone: "+1 (555) 567-8901",
      email: "maria.gonzalez@temerproperties.com",
      specialties: ["Luxury Estates", "High-End Condos", "Exclusive Listings"],
      rating: 4.8,
      salesCount: 103
    },
    {
      id: "6",
      name: "Robert Kim",
      role: "Commercial Real Estate Agent",
      photo: agentPhoto2,
      phone: "+1 (555) 678-9012",
      email: "robert.kim@temerproperties.com",
      specialties: ["Office Buildings", "Retail Spaces", "Industrial Properties"],
      rating: 4.6,
      salesCount: 67
    }
  ];

  const teamStats = [
    { icon: Users, label: "Team Members", value: "12+", description: "Experienced professionals" },
    { icon: Star, label: "Average Rating", value: "4.8", description: "Client satisfaction" },
    { icon: Award, label: "Years Combined", value: "85+", description: "Industry experience" },
    { icon: TrendingUp, label: "Sales Volume", value: "ETB 12.5B+", description: "Lifetime sales" }
  ];

  const handleCall = (phone) => console.log("Call:", phone);
  const handleEmail = (email) => console.log("Email:", email);
  const handleMessage = (id) => console.log("Message agent:", id);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                {...member}
                onCall={handleCall}
                onEmail={handleEmail}
                onMessage={handleMessage}
              />
            ))}
          </div>
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