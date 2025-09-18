import BlogCard from '../BlogCard';
import modernInterior from "@assets/generated_images/Modern_apartment_interior_61087e44.png";
import agentPhoto from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";

export default function BlogCardExample() {
  //todo: remove mock functionality
  const handleReadMore = (id) => console.log('Read more:', id);

  return (
    <div className="p-6 max-w-sm">
      <BlogCard
        id="1"
        title="2024 Real Estate Market Trends: What Buyers Need to Know"
        excerpt="Discover the latest trends shaping the real estate market this year, from pricing fluctuations to emerging neighborhoods and investment opportunities."
        coverImage={modernInterior}
        author={{
          name: "Sarah Johnson",
          avatar: agentPhoto
        }}
        publishDate="Mar 15, 2024"
        readTime="5 min read"
        category="Market Insights"
        onReadMore={handleReadMore}
      />
    </div>
  );
}