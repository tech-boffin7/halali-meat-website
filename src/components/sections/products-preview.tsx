
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

const ProductsPreview = memo(function ProductsPreview() {
  const previewProducts = products.slice(0, 4);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Our Products</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse of our premium, halal-certified meat selections, sourced with care and delivered with trust.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {previewProducts.map((product) => (
            <div key={product.id} className="bg-card border border-border/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col group">
              <div className="relative h-60 w-full overflow-hidden">
                <Image 
                src={product.image || '/images/placeholder.jpg'} 
                alt={product.name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
                <Badge variant="secondary" className="absolute top-3 right-3">{product.type}</Badge>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link href={`/products`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/products">Explore All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
});

export default ProductsPreview;
