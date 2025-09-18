import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, Send } from "lucide-react";
import { Link } from "wouter";
import temerLogo from "@assets/images (2)_1755853378467-D-9Sw1o__1758104048014.jpg";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    console.log('Newsletter signup:', email);
    (e.target as HTMLFormElement).reset();
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  const footerLinks = {
    "Properties": [
      { label: "Homes for Sale", href: "/listings?status=sale" },
      { label: "Homes for Rent", href: "/listings?status=rent" },
      { label: "Luxury Properties", href: "/listings?featured=true" },
      { label: "Commercial", href: "/listings?type=commercial" },
      { label: "Property Valuation", href: "/valuation" }
    ],
    "Services": [
      { label: "Buying", href: "/services/buying" },
      { label: "Selling", href: "/services/selling" },
      { label: "Renting", href: "/services/renting" },
      { label: "Property Management", href: "/services/management" },
      { label: "Investment Consulting", href: "/services/investment" }
    ],
    "Company": [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ],
    "Support": [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Sitemap", href: "/sitemap" }
    ]
  };

  return (
    <footer className="bg-card text-card-foreground border-t">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-2">
                Stay Updated with Market Trends
              </h3>
              <p className="text-primary-foreground/90">
                Get the latest property listings, market insights, and exclusive deals delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 flex-1"
                required
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit" 
                variant="secondary"
                data-testid="button-newsletter-submit"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <img 
                  src={temerLogo} 
                  alt="Temer Properties" 
                  className="h-10 w-auto rounded-md"
                />
                <div className="font-heading font-bold text-xl">
                  Temer Properties
                </div>
              </Link>
              
              <p className="text-muted-foreground mb-6 max-w-sm">
                Your trusted partner in real estate. We help you find the perfect property and make your real estate dreams a reality.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@temerproperties.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>123 Real Estate Blvd, Miami, FL 33101</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary hover:text-primary-foreground"
                    asChild
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <a href={social.href} aria-label={social.label}>
                      <social.icon className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Temer Properties. All rights reserved. Licensed Real Estate Brokerage.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}