import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '@/lib/api';
import temerLogo from "@assets/images (2)_1755853378467-D-9Sw1o__1758104048014.jpg";

export default function Footer() {
  // Fetch admin settings for social media links
  const { data: settingsData } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getPublicSettings
  });

  const adminSettings = settingsData?.data || {};
  
  // Create social links from admin settings (check both flat and grouped structure)
  const socialSettings = adminSettings.social || adminSettings;
  const socialLinks = [
    { icon: Facebook, href: socialSettings.social_facebook || "", label: "Facebook" },
    { icon: Twitter, href: socialSettings.social_twitter || "", label: "Twitter" },
    { icon: Instagram, href: socialSettings.social_instagram || "", label: "Instagram" },
    { icon: Linkedin, href: socialSettings.social_linkedin || "", label: "LinkedIn" },
    { icon: Youtube, href: socialSettings.social_youtube || "", label: "YouTube" }
  ].filter(link => link.href && link.href.trim()); // Only show links that have valid URLs

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
              <div>© 2024 Temer Properties. All rights reserved. Licensed Real Estate Brokerage.</div>
              <div className="mt-1 text-xs">
                For Website Development Contact Us{' '}
                <a 
                  href="https://t.me/Ethioads012" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer"
                  data-testid="link-website-development"
                >
                  @Ethioads012
                </a>
              </div>
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