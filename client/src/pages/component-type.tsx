
import { useParams, Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PC_COMPONENT_LABELS, COMPONENT_BRANDS, type PCComponentType } from "@shared/schema";
import { ChevronLeft } from "lucide-react";

export default function ComponentTypePage() {
  const params = useParams<{ type: string }>();
  const componentType = params.type as PCComponentType;
  
  const brands = COMPONENT_BRANDS[componentType] || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="py-4 px-4 border-b">
          <div className="mx-auto max-w-7xl">
            <Link href="/pc-components">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to PC Components
              </Button>
            </Link>
          </div>
        </div>

        <section className="py-8 px-4 border-b">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              {PC_COMPONENT_LABELS[componentType]}
            </h1>
            <p className="text-muted-foreground">
              Select a brand to view products
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link key={brand} href={`/pc-components/${componentType}/${brand.toLowerCase()}`}>
                  <Card className="group hover-elevate cursor-pointer h-full">
                    <CardContent className="p-8 flex items-center justify-center">
                      <h3 className="font-semibold text-xl">{brand}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
