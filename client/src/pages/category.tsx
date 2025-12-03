import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CATEGORIES, 
  CATEGORY_LABELS, 
  type Product, 
  type Category,
  type ProductsResponse 
} from "@shared/schema";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const CATEGORY_DRAWBACKS: Record<Category, string> = {
  cpus: "Common CPU issues include thermal throttling under heavy loads, compatibility problems with older motherboards, and power consumption concerns. High-end models often require expensive cooling solutions.",
  gpus: "Graphics cards frequently suffer from coil whine, driver stability issues, and high power draw. Many models run hot and loud under load, and availability can be limited during high demand periods.",
  laptops: "Laptop drawbacks typically include limited upgradability, thermal constraints affecting performance, mediocre battery life under heavy use, and display quality compromises in budget models.",
  phones: "Smartphone issues commonly include battery degradation over time, software support limitations, fragile displays, and varying camera quality in different lighting conditions.",
  headphones: "Headphone problems often involve comfort issues during extended use, Bluetooth connectivity problems, limited noise cancellation effectiveness, and microphone quality concerns for calls.",
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category as Category;
  const [sortBy, setSortBy] = useState("name");

  const isValidCategory = CATEGORIES.includes(category);

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", category, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({ category, sort: sortBy });
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: isValidCategory,
  });

  if (!isValidCategory) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground">
              The category "{category}" doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Category Header */}
        <section className="py-8 px-4 border-b" data-testid="section-category-header">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-category-title">
              {CATEGORY_LABELS[category]}
            </h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              {CATEGORY_DRAWBACKS[category]}
            </p>
            {data && (
              <p className="text-sm text-muted-foreground mt-4" data-testid="text-product-count">
                {data.total} {data.total === 1 ? "product" : "products"}
              </p>
            )}
          </div>
        </section>

        {/* Filter/Sort Bar */}
        <section className="py-4 px-4 border-b bg-card/50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Sort by:
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-8 px-4" data-testid="section-products">
          <div className="mx-auto max-w-7xl">
            <ProductGrid 
              products={data?.products || []} 
              isLoading={isLoading}
              emptyMessage={`No ${CATEGORY_LABELS[category]} products found`}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
