import { BookOpen, Heart, ShieldCheck, Sun } from 'lucide-react';
import Image from 'next/image';

const standards = [
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: '1. Humane Treatment (Ihsan)',
    description: 'Animal welfare is paramount. We ensure all animals are treated with kindness, provided with clean water and food, and are never stressed or harmed. This is our ethical and religious obligation.'
  },
  {
    icon: <Sun className="h-10 w-10 text-primary" />,
    title: '2. Health & Condition',
    description: 'Only healthy, well-rested animals are selected for slaughter. They are inspected by qualified veterinarians to ensure they are free from any disease or injury before processing.'
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: '3. The Tasmiyah & Takbir',
    description: 'The slaughter is performed by a sane, adult Muslim who invokes the name of Allah (Bismillah, Allahu Akbar) over the animal, acknowledging the sanctity of life.'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: '4. Swift & Precise Incision',
    description: 'A razor-sharp knife is used to make a swift, deep incision that cuts the windpipe, jugular veins, and carotid arteries, ensuring a rapid and painless death. The spinal cord is left intact.'
  }
];

const HalalStandardsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Our Commitment to Halal</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Faith, ethics, and quality are at the core of our process.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
          <Image src="/images/halal-certification.jpg" alt="Halal certification document" fill className="object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">The Halal Process</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Halal is more than just a method of slaughter; it is a complete system of ethics and hygiene that governs how an animal is raised, treated, and processed. Our commitment to halal is unwavering, ensuring that every product we export is pure (tayyib) and permissible for consumption.
          </p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold pt-4">Certifications & Compliance</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We are certified by leading halal authorities and regularly undergo rigorous audits to maintain our credentials. Our operations comply with both local and international standards, including those recognized by the Gulf Cooperation Council (GCC), to guarantee market access and consumer trust.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12">The Four Pillars of Halal Slaughter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((standard, index) => (
            <div key={index} className="p-6 bg-card rounded-lg shadow-sm border border-border/50">
              <div className="flex justify-center items-center mb-4 mx-auto h-16 w-16 rounded-full bg-primary/10">
                {standard.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 text-center">{standard.title}</h3>
              <p className="text-sm text-muted-foreground text-center">{standard.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HalalStandardsPage;