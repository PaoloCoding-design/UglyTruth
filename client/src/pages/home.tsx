import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { ProductGrid } from "@/components/product-grid";
import { CATEGORIES, type Product, type Category } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Monitor } from "lucide-react";

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
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-muted/50 to-background" data-testid="section-hero">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Find the Ugly Truth
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Unbiased, AI-powered product reviews that reveal what others won't tell you.
            </p>
            <SearchBar />
          </div>
        </section>

        {/* Main Categories Section */}
        <section className="py-16 px-4" data-testid="section-categories">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center" data-testid="text-categories-title">
              Browse Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/pc-components">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted">
                      <Cpu className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1">
                      PC Components
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      CPUs, GPUs, RAM, and more
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/category/laptops">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted">
                      <Monitor className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1">
                      Other Electronics
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Laptops, phones, headphones
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}