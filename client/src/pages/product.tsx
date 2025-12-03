import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WarningBanner } from "@/components/warning-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CATEGORY_LABELS, 
  type Product, 
  type Category 
} from "@shared/schema";
import { 
  ExternalLink, 
  AlertTriangle, 
  ListMinus, 
  XCircle,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
  });

  // Mutation to generate review on-demand
  const generateReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/products/${id}/generate-review`);
    },
    onSuccess: () => {
      // Refetch product data after review is generated
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId] });
    },
  });

  // Automatically trigger review generation if not available
  useEffect(() => {
    if (product && !product.reviewGenerated && !generateReviewMutation.isPending) {
      generateReviewMutation.mutate(product.id);
    }
  }, [product?.id, product?.reviewGenerated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <WarningBanner />
        <main className="flex-1 py-8 px-4">
          <div className="mx-auto max-w-7xl">
            <ProductSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if review is being generated
  const isGeneratingReview = generateReviewMutation.isPending || (!product.reviewGenerated && !generateReviewMutation.isError);

  // Parse the stored JSON content
  const categoryDrawbacks = parseJsonArray(product.categoryDrawbacks);
  const modelDrawbacks = parseJsonDrawbacks(product.modelDrawbacks);
  const doNotBuyIf = parseJsonArray(product.doNotBuyIf);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <WarningBanner />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="py-4 px-4 border-b">
          <div className="mx-auto max-w-7xl">
            <Link href={`/category/${product.category}`}>
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
                <ChevronLeft className="h-4 w-4" />
                Back to {CATEGORY_LABELS[product.category as Category]}
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Header */}
        <section className="py-8 px-4" data-testid="section-product-header">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted max-w-md mx-auto lg:mx-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <AlertTriangle className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <Badge variant="secondary" className="uppercase text-xs font-medium" data-testid="badge-product-category">
                  {CATEGORY_LABELS[product.category as Category]}
                </Badge>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {product.brand}
                </p>
                <h1 className="font-heading text-3xl md:text-4xl font-bold" data-testid="text-product-name">
                  {product.name}
                </h1>
                
                {/* Worst Issue */}
                {product.worstIssue && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive mb-1">
                      Worst Reported Issue
                    </p>
                    <p className="text-sm" data-testid="text-worst-issue">
                      {product.worstIssue}
                    </p>
                  </div>
                )}

                {/* Affiliate Button */}
                {product.affiliateLink && (
                  <div className="pt-4">
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      data-testid="link-affiliate"
                    >
                      <Button size="lg" className="gap-2">
                        View Price
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      Opens in a new tab. We may earn a commission.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Review Sections */}
        <section className="py-8 px-4 bg-card" data-testid="section-reviews">
          <div className="mx-auto max-w-4xl space-y-12">
            {/* Generating Review Indicator */}
            {isGeneratingReview && (
              <Card className="border-dashed" data-testid="card-generating">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">Generating Ugly Review</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI is analyzing this product's drawbacks...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category-Level Drawbacks */}
            <Card data-testid="card-category-drawbacks">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-2 rounded-md bg-muted">
                  <ListMinus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl">
                    {CATEGORY_LABELS[product.category as Category]} Drawbacks
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    General negatives about this product type
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isGeneratingReview ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-10/12" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : categoryDrawbacks.length > 0 ? (
                  <ul className="space-y-3">
                    {categoryDrawbacks.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-muted-foreground mt-0.5">&mdash;</span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No category drawbacks available.</p>
                )}
              </CardContent>
            </Card>

            {/* Model-Specific Drawbacks */}
            <Card data-testid="card-model-drawbacks">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-2 rounded-md bg-muted">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl">
                    Model-Specific Issues
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common complaints reported for this specific product
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isGeneratingReview ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : modelDrawbacks.length > 0 ? (
                  <ol className="space-y-4">
                    {modelDrawbacks.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">No model-specific issues available.</p>
                )}
              </CardContent>
            </Card>

            {/* Do Not Buy If */}
            <Card data-testid="card-do-not-buy">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-2 rounded-md bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="font-heading text-xl">
                    Do Not Buy If...
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    User profiles who may be dissatisfied with this product
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isGeneratingReview ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : doNotBuyIf.length > 0 ? (
                  <ul className="space-y-3">
                    {doNotBuyIf.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-4 h-4 mt-0.5 border-2 rounded-sm border-muted-foreground/50" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific recommendations available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bottom CTA */}
        {product.affiliateLink && (
          <section className="py-12 px-4" data-testid="section-cta">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-heading text-2xl font-bold mb-4">
                Still interested?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you've considered the drawbacks and still want to proceed, you can check the current price below.
              </p>
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                data-testid="link-affiliate-bottom"
              >
                <Button size="lg" className="gap-2">
                  View Price
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-4">
                Affiliate link. We may earn a commission from qualifying purchases.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full max-w-md rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Helper functions to parse JSON content
function parseJsonArray(content: string | null): string[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonDrawbacks(content: string | null): { title: string; description: string }[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
