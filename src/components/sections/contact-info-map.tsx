'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfoMap = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 md:gap-8">
      <div className="bg-secondary/50 p-6 rounded-lg border border-border/50 lg:w-1/2">
        <h2 className="text-xl font-bold mb-4">Our Information</h2>
        <div className="space-y-4">
          <a href="mailto:info@halalimeatltd.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm">info@halalimeatltd.com</span>
          </a>
          <a href="tel:+254123456789" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm">+254 123 456 789</span>
          </a>
          <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary mt-1" />
            <span className="text-sm">Nairobi, Kenya</span>
          </div>
        </div>
      </div>
      <div className="h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-border/50 lg:w-1/2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.3585373444!2d36.7073084966797!3d-1.302860800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1679584991597!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale contrast-125"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactInfoMap;
