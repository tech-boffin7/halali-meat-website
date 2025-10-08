import Image from 'next/image';
import { Package, Scissors, Ship, Search } from 'lucide-react';

const services = [
  {
    icon: <Package className="h-10 w-10 text-primary" />,
    title: 'Wholesale Supply',
    description: 'We provide bulk orders of premium halal meat, tailored to the specific needs of importers, distributors, and large-scale retailers. Our process ensures consistent quality and timely delivery for every client.'
  },
  {
    icon: <Scissors className="h-10 w-10 text-primary" />,
    title: 'Slaughter & Processing',
    description: 'Our state-of-the-art facilities and certified professionals ensure that every step, from slaughter to deboning and packaging, is 100% halal compliant and meets the highest international food safety standards.'
  },
  {
    icon: <Ship className="h-10 w-10 text-primary" />,
    title: 'Export & Logistics',
    description: 'We manage the entire export process, including documentation, cold chain logistics, and customs clearance, to ensure your shipment arrives fresh and on time, primarily to the GCC and other global markets.'
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Supply Chain Transparency',
    description: 'Gain full visibility into your order with our transparent supply chain. We provide complete traceability from the source farm to the final destination, giving you confidence in the product you receive.'
  }
];

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">Our Services</h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">End-to-end solutions for your halal meat import needs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
          <Image src="/images/services-logistics.jpg" alt="Logistics and shipping containers" layout="fill" objectFit="cover" />
        </div>
        <div className="space-y-8">
          {services.slice(0, 2).map((service, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
         <div className="space-y-8 md:order-2">
          {services.slice(2, 4).map((service, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg md:order-1">
           <Image src="/images/hero-bg.jpg" alt="A processing facility" layout="fill" objectFit="cover" />
        </div>
      </div>

    </div>
  );
};

export default ServicesPage;