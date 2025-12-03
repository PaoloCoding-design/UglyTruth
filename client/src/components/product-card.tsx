import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Product, type Category } from "@shared/schema";
import { AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} data-testid={`card-product-${product.id}`}>
      <Card className="group overflow-visible hover-elevate cursor-pointer h-full">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="p-2 rounded-md bg-ugly-red/10 inline-flex">
                  <AlertTriangle className="h-4 w-4 text-ugly-red" />
                </div>
              </div>
            )}
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 text-xs uppercase font-medium"
              data-testid={`badge-category-${product.id}`}
            >
              {CATEGORY_LABELS[product.category as Category] || product.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {product.brand}
            </p>
            <h3 className="font-semibold text-base leading-tight line-clamp-2" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>

            {/* Worst Issue Preview */}
            {product.worstIssue && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-destructive">Worst reported issue:</span>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {product.worstIssue}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}