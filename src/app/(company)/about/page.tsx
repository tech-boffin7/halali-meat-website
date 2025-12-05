import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">About Halali Meat Ltd</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Connecting the world to premium, ethically sourced halal meat from the heart of Africa.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Founded on the principles of faith, quality, and reliability, Halali Meat Ltd was born from a desire to share the rich pastoralist heritage of East Africa with the world. We began our journey by partnering with local farmers in Kenya, Tanzania, and Somalia, communities that have perfected the art of raising livestock naturally and sustainably for generations. Our goal is to provide a global market for their premium, grass-fed animals while ensuring strict adherence to halal practices.
            </p>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Mission & Vision</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
              <strong className="text-foreground">Mission:</strong> To be the most trusted exporter of premium halal meat, championing ethical sourcing, and delivering unparalleled quality from East Africa to the world.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Vision:</strong> To empower pastoralist communities, promote sustainable agriculture, and become the global benchmark for halal excellence and supply chain transparency.
            </p>
          </div>
        </div>
        <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
          <Image src="/images/about-farm.jpg" alt="Lush pastures of an East African farm" fill className="object-cover" />
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Our Halal Commitment</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Certified Slaughtering</h3>
              <p className="text-muted-foreground text-sm mt-1">Every animal is processed by a certified Muslim slaughterman in a registered, hygienic facility, strictly following Sharia law.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Animal Welfare</h3>
              <p className="text-muted-foreground text-sm mt-1">We ensure animals are treated humanely, are healthy, and are free from any abuse or stress before and during slaughter.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Quality & Hygiene</h3>
              <p className="text-muted-foreground text-sm mt-1">Our facilities adhere to the highest international standards for hygiene and food safety, from processing to packaging.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Third-Party Audits</h3>
              <p className="text-muted-foreground text-sm mt-1">We welcome regular audits from recognized halal certification bodies to ensure continuous compliance and trust.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;