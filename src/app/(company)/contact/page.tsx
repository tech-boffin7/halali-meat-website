'use client';

import EmailContactForm from '@/components/forms/email-contact-form';
import WhatsAppContactForm from '@/components/forms/whatsapp-contact-form';
import ContactInfoMap from '@/components/sections/contact-info-map';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you. Reach out with any questions or for a quote.</p>
      </div>

      {/* Forms Section */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-8 md:mb-12">
        <EmailContactForm />
        <WhatsAppContactForm />
      </div>

      {/* Contact Info & Map Section */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <ContactInfoMap />
      </div>
    </div>
  );
};

export default ContactPage;