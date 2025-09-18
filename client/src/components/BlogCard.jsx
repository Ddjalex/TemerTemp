import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogCard({
  id,
  title,
  excerpt,
  coverImage,
  author,
  publishDate,
  readTime,
  category,
  onReadMore
}) {

  const handleReadMore = () => {
    console.log('Read more clicked for post:', id);
    onReadMore(id);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover-elevate group cursor-pointer" data-testid={`card-blog-${id}`}>
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${id}`}>
          {title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-excerpt-${id}`}>
          {excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-muted text-xs">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate" data-testid={`text-author-${id}`}>
              {author.name}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span data-testid={`text-date-${id}`}>{publishDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span data-testid={`text-read-time-${id}`}>{readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Button
          variant="ghost"
          onClick={handleReadMore}
          className="w-full justify-between group/btn p-0 h-auto font-medium hover:bg-transparent hover:text-primary"
          data-testid={`button-read-more-${id}`}
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}