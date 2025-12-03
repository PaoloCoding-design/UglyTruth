import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { type ProductsResponse } from "@shared/schema";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const searchParams = new URLSearchParams(useSearch());
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["/api/products/search", query],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      const res = await fetch(`/api/products/search?${params}`);
      if (!res.ok) throw new Error("Failed to search products");
      return res.json();
    },
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <section className="py-8 px-4 border-b" data-testid="section-search-header">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <SearchIcon className="h-6 w-6 text-muted-foreground" />
              <h1 className="font-heading text-2xl font-bold">
                Search Results
              </h1>
            </div>
            <SearchBar size="default" placeholder="Search for another product..." />
          </div>
        </section>

        {/* Results */}
        <section className="py-8 px-4" data-testid="section-search-results">
          <div className="mx-auto max-w-7xl">
            {query ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {isLoading ? (
                      "Searching..."
                    ) : data ? (
                      <>
                        Found <span className="font-medium text-foreground">{data.total}</span>{" "}
                        {data.total === 1 ? "result" : "results"} for{" "}
                        <span className="font-medium text-foreground">"{query}"</span>
                      </>
                    ) : (
                      `Searching for "${query}"...`
                    )}
                  </p>
                </div>
                <ProductGrid 
                  products={data?.products || []} 
                  isLoading={isLoading}
                  emptyMessage={`No products found for "${query}"`}
                />
              </>
            ) : (
              <div className="text-center py-16">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
                <p className="text-muted-foreground">
                  Type in the search bar above to find products
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
