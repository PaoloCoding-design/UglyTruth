import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Monitor, Laptop, Smartphone, Headphones, LucideIcon } from "lucide-react";
import { type Category, CATEGORY_LABELS } from "@shared/schema";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  cpus: Cpu,
  gpus: Monitor,
  laptops: Laptop,
  phones: Smartphone,
  headphones: Headphones,
};

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  cpus: "Processors and computing chips",
  gpus: "Graphics cards and video adapters",
  laptops: "Portable computers and notebooks",
  phones: "Smartphones and mobile devices",
  headphones: "Audio headphones and earbuds",
};

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export function CategoryCard({ category, productCount = 0 }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category];
  
  return (
    <Link href={`/category/${category}`} data-testid={`card-category-${category}`}>
      <Card className="group hover-elevate cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-4 rounded-full bg-muted">
            <Icon className="h-8 w-8 text-foreground" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-1">
            {CATEGORY_LABELS[category]}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
          {productCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {productCount} products
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
