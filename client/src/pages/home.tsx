import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { ProductGrid } from "@/components/product-grid";
import { CategoryCard } from "@/components/category-card";
import { CATEGORIES, type Product, type Category } from "@shared/schema";

export default function Home() {
  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", "featured"],
  });

  // Fetch category counts
  const { data: categoryCounts } = useQuery<Record<Category, number>>({
    queryKey: ["/api/categories/counts"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero/Statement Section */}
        <section className="py-16 md:py-24 px-4" data-testid="section-hero">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              See the potential downsides
              <br />
              <span className="text-muted-foreground">before you buy.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              We focus exclusively on what could go wrong. AI-generated summaries of 
              real user complaints and product drawbacks to help you make informed decisions.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar size="large" placeholder="Search for a product..." />
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 px-4 bg-card" data-testid="section-featured">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-2xl font-bold">Trending Products</h2>
                <p className="text-muted-foreground mt-1">
                  Popular products with notable drawbacks
                </p>
              </div>
            </div>
            <ProductGrid 
              products={featuredProducts || []} 
              isLoading={featuredLoading}
              emptyMessage="No featured products available"
            />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4" data-testid="section-categories">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl font-bold mb-2">Browse by Category</h2>
              <p className="text-muted-foreground">
                Explore drawbacks by product type
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((category) => (
                <CategoryCard
                  key={category}
                  category={category}
                  productCount={categoryCounts?.[category] || 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
