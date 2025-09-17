import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, we couldn't find the page you're looking for. The property listing or page you requested may have been moved, sold, or no longer exists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" data-testid="button-go-home">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t">
          <h3 className="font-heading font-semibold text-xl mb-4">
            Looking for something specific?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="ghost" data-testid="link-browse-properties">
              <Link href="/listings">Browse Properties</Link>
            </Button>
            <Button asChild variant="ghost" data-testid="link-meet-team">
              <Link href="/team">Meet Our Team</Link>
            </Button>
            <Button asChild variant="ghost" data-testid="link-contact-us">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}