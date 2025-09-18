import ContactForm from '../ContactForm';

export default function ContactFormExample() {
  //todo: remove mock functionality
  const handleSubmit = (data) => {
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="p-6">
      <ContactForm onSubmit={handleSubmit} />
    </div>
  );
}