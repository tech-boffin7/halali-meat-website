'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  Facebook,
  Loader2,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Twitter,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  category: string;
  createdAt?: string | Date;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
] as const;

const PRODUCTS_PER_PAGE = 9;

// Product Quick View Modal
function ProductQuickView({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-80 w-full rounded-lg overflow-hidden">
            <Image
              src={product.image || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">{product.type}</Badge>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            {product.category && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{product.category}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-semibold">100% Halal Certified</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href={`/get-a-quote?product=${encodeURIComponent(product.name)}`}>Request a Quote</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Share Product Component
function ShareProduct({ product, isOpen, onClose }: { product: Product; isOpen: boolean; onClose: () => void }) {
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/products#${product.id}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success('Link copied to clipboard!');
  };

  const shareToTwitter = () => {
    const text = `Check out ${product.name} - Premium Halal Meat`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={productUrl} readOnly className="flex-1" />
            <Button size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={shareToTwitter} className="gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" onClick={shareToFacebook} className="gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ProductsPageClient = memo(function ProductsPageClient({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Check if product is new (created in last 7 days)
  const isNewProduct = useCallback((product: Product) => {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }, []);

  // Get unique categories - memoized
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  // Filter and sort products - memoized with all dependencies
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return sorted;
  }, [products, searchQuery, selectedType, selectedCategory, sortBy]);

  // Visible products based on pagination
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Count active filters - memoized
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'ALL') count++;
    if (selectedCategory !== 'ALL') count++;
    if (searchQuery) count++;
    return count;
  }, [selectedType, selectedCategory, searchQuery]);

  // Clear all filters - useCallback for stable reference
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
    setSortBy('newest');
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  // Load more products
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedType, selectedCategory, sortBy]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!infiniteScrollEnabled || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredProducts.length) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [infiniteScrollEnabled, isLoadingMore, visibleCount, filteredProducts.length, handleLoadMore]);

  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          Our Products
        </h1>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our range of premium, 100% halal-certified meat products
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{products.length} Products Available</span>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Type Filters */}
          <div className="flex gap-2">
            <Button 
              variant={selectedType === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('ALL')}
            >
              All Types
            </Button>
            <Button 
              variant={selectedType === 'FROZEN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('FROZEN')}
            >
              Frozen
            </Button>
            <Button 
              variant={selectedType === 'CHILLED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('CHILLED')}
            >
              Chilled
            </Button>
          </div>

          {/* Category Filter Toggle */}
          {categories.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Categories
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-5 min-w-[20px] rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-accent cursor-pointer transition-colors"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Infinite Scroll Toggle */}
          <Button
            variant={infiniteScrollEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInfiniteScrollEnabled(!infiniteScrollEnabled)}
            className="gap-2"
            data-tooltip={infiniteScrollEnabled ? 'Infinite scroll ON' : 'Infinite scroll OFF'}
          >
            <ExternalLink className="h-4 w-4" />
            Auto-load
          </Button>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Category Pills */}
        <AnimatePresence>
          {showFilters && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap justify-center gap-2 overflow-hidden"
            >
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground mb-6"
        >
          Showing <span className="font-semibold text-foreground">{visibleProducts.length}</span> of{' '}
          <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
          {(searchQuery || activeFiltersCount > 0) && ' (filtered)'}
        </motion.div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index % PRODUCTS_PER_PAGE * 0.05, 0.4)
                }}
                className="bg-card border border-border/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image 
                    src={product.image || '/images/placeholder.jpg'} 
                    alt={product.name} 
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 shadow-lg backdrop-blur-sm"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 shadow-lg backdrop-blur-sm"
                      onClick={() => setShareProduct(product)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge variant="secondary" className="shadow-sm">
                      {product.type}
                    </Badge>
                    {isNewProduct(product) && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm gap-1">
                        <Sparkles className="h-3 w-3" />
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">
                    {product.description}
                  </p>
                  {product.category && (
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {product.category}
                    </p>
                  )}
                  <div className="flex items-center text-primary gap-2 mb-4">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-semibold text-xs">100% Halal Certified</span>
                  </div>
                  <Button asChild variant="outline" className="w-full mt-auto">
                    <Link href={`/get-a-quote?product=${encodeURIComponent(product.name)}`}>Request a Quote</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button / Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-12">
              {!infiniteScrollEnabled ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    size="lg"
                    variant="outline"
                    className="gap-2 min-w-[200px]"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Products
                        <Badge variant="secondary" className="ml-2">
                          +{Math.min(PRODUCTS_PER_PAGE, filteredProducts.length - visibleCount)}
                        </Badge>
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                isLoadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more products...</span>
                  </div>
                )
              )}
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No products match "${searchQuery}"`
              : 'Try adjusting your filters'}
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Share Modal */}
      {shareProduct && (
        <ShareProduct
          product={shareProduct}
          isOpen={shareProduct !== null}
          onClose={() => setShareProduct(null)}
        />
      )}
    </div>
  );
});
