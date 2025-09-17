import TeamMemberCard from '../TeamMemberCard';
import agentPhoto from "@assets/generated_images/Real_estate_agent_portrait_fda206b8.png";

export default function TeamMemberCardExample() {
  //todo: remove mock functionality
  const handleCall = (phone: string) => console.log('Call:', phone);
  const handleEmail = (email: string) => console.log('Email:', email);
  const handleMessage = (id: string) => console.log('Message:', id);

  return (
    <div className="p-6 max-w-sm">
      <TeamMemberCard
        id="1"
        name="Sarah Johnson"
        role="Senior Real Estate Agent"
        photo={agentPhoto}
        phone="+1 (555) 123-4567"
        email="sarah.johnson@temerproperties.com"
        specialties={["Luxury Homes", "Waterfront", "Investment"]}
        rating={4.8}
        salesCount={127}
        onCall={handleCall}
        onEmail={handleEmail}
        onMessage={handleMessage}
      />
    </div>
  );
}