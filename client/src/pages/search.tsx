import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilters, type FilterState } from "@/components/category-filters";
import { type ProductsResponse } from "@shared/schema";
import { Search as SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";

export default function SearchPage() {
  const searchParams = new URLSearchParams(useSearch());
  const query = searchParams.get("q") || "";
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedBrands: [],
    priceRange: [0, 5000],
  });

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

  // Extract unique brands from search results
  const brands = useMemo(() => {
    if (!data?.products) return [];
    const uniqueBrands = new Set(data.products.map(p => p.brand));
    return Array.from(uniqueBrands).sort();
  }, [data?.products]);

  // Filter search results
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    return data.products.filter(product => {
      if (filters.searchQuery) {
        const filterQuery = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(filterQuery);
        const matchesBrand = product.brand.toLowerCase().includes(filterQuery);
        if (!matchesName && !matchesBrand) return false;
      }

      if (filters.selectedBrands.length > 0) {
        if (!filters.selectedBrands.includes(product.brand)) return false;
      }
      
      return true;
    });
  }, [data?.products, filters]);

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
                        Found <span className="font-medium text-foreground">{filteredProducts.length}</span>{" "}
                        {filteredProducts.length === 1 ? "result" : "results"} for{" "}
                        <span className="font-medium text-foreground">"{query}"</span>
                      </>
                    ) : (
                      `Searching for "${query}"...`
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                  {/* Filters Sidebar */}
                  {data && data.products.length > 0 && (
                    <aside className="lg:sticky lg:top-4 h-fit">
                      <CategoryFilters 
                        brands={brands}
                        onFilterChange={setFilters}
                      />
                    </aside>
                  )}

                  {/* Product Grid */}
                  <div className={data && data.products.length > 0 ? "" : "lg:col-span-2"}>
                    <ProductGrid 
                      products={filteredProducts} 
                      isLoading={isLoading}
                      emptyMessage={`No products found for "${query}"`}
                    />
                  </div>
                </div>
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
