
import { Globe, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { memo } from 'react';

const highlights = [
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Global Exports',
    description: 'Supplying premium halal meat to the GCC, Middle East, and other international markets.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Certified Halal',
    description: 'Strict adherence to Islamic slaughtering and processing standards, certified by recognized bodies.',
  },
  {
    icon: <Leaf className="h-8 w-8 text-primary" />,
    title: 'Grass-Fed & Natural',
    description: 'Our livestock are sourced from pastoralist communities, ensuring natural, grass-fed quality.',
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: 'Transparent Supply Chain',
    description: 'From the farm to your destination, we provide full transparency and traceability.',
  },
];

const HighlightsSection = memo(function HighlightsSection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-lg shadow-lg border border-border/50">
              <div className="flex justify-center items-center mb-4 mx-auto h-16 w-16 rounded-full bg-primary/10">
                {highlight.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
              <p className="text-muted-foreground text-sm">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HighlightsSection;
