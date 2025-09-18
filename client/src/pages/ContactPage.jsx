import ContactForm from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Award, Users } from "lucide-react";

export default function ContactPage() {
  const handleFormSubmit = (data) => {
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you within 24 hours.');
  };

  const officeLocations = [
    {
      name: "Main Office - Downtown Miami",
      address: "123 Real Estate Blvd, Suite 100\nMiami, FL 33101",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri: 8:00 AM - 7:00 PM\nSat: 9:00 AM - 5:00 PM\nSun: 11:00 AM - 4:00 PM"
    },
    {
      name: "Coral Gables Branch",
      address: "456 Miracle Mile\nCoral Gables, FL 33134",
      phone: "+1 (555) 234-5678",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed"
    },
    {
      name: "Miami Beach Office",
      address: "789 Ocean Drive\nMiami Beach, FL 33139",
      phone: "+1 (555) 345-6789",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: 12:00 PM - 3:00 PM"
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Licensed Professionals",
      description: "All our agents are fully licensed and regularly trained on the latest market trends and regulations."
    },
    {
      icon: Users,
      title: "Personalized Service", 
      description: "We provide one-on-one attention and tailor our approach to meet your specific real estate needs."
    },
    {
      icon: Clock,
      title: "Quick Response Time",
      description: "We respond to all inquiries within 2 hours during business hours and 24 hours on weekends."
    },
    {
      icon: MapPin,
      title: "Local Market Expertise",
      description: "Deep knowledge of Miami-Dade County markets helps us find the best opportunities for our clients."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Contact Us
          </Badge>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-6">
            Let's Start Your Real Estate Journey
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Ready to buy, sell, or rent? Our experienced team is here to help you navigate the real estate market with confidence. Get in touch today for a personalized consultation.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Our Office Locations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit us at any of our convenient locations throughout Miami-Dade County. Our doors are always open for consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((location, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">{location.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        {location.address.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Phone: </span>
                    <span className="text-primary">{location.phone}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Hours:</span>
                    <div className="mt-1 text-muted-foreground">
                      {location.hours.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Temer Properties?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing exceptional service and helping you achieve your real estate goals with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center p-6 hover-elevate">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Don't wait - the perfect property could be just one conversation away. Contact us today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-md font-medium transition-colors">
              Call +1 (555) 123-4567
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md font-medium transition-colors">
              Schedule Appointment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}