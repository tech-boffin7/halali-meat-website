'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
}

export function ProductsPageClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    return p.type.toLowerCase() === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Our Products</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Explore our range of premium, 100% halal-certified meat products.</p>
      </div>

      <div className="flex justify-center gap-2 mb-10">
        <Button variant={filter === 'all' ? 'default' : 'ghost'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'frozen' ? 'default' : 'ghost'} onClick={() => setFilter('frozen')}>Frozen</Button>
        <Button variant={filter === 'chilled' ? 'default' : 'ghost'} onClick={() => setFilter('chilled')}>Chilled</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card border border-border/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col group">
            <div className="relative h-60 w-full overflow-hidden">
              <Image 
                src={product.image || '/images/placeholder.jpg'} 
                alt={product.name} 
                layout="fill" 
                objectFit="cover" 
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <Badge variant="secondary" className="absolute top-3 right-3">{product.type}</Badge>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-base sm:text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
              <div className="flex items-center text-primary gap-2 mb-5">
                <ShieldCheck size={18} />
                <span className="font-semibold text-xs">100% Halal Compliant</span>
              </div>
              <Button asChild variant="outline" className="w-full mt-auto">
                <a href="/get-a-quote">Request a Quote</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
