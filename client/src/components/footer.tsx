import { Link } from "wouter";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@shared/schema";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading text-lg font-bold mb-4">The Ugly</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              We show you the potential downsides before you buy. Our AI-generated summaries 
              focus exclusively on product drawbacks, helping you make informed decisions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-${category}`}
                  >
                    {CATEGORY_LABELS[category as Category]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Affiliate Disclosure
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} The Ugly. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              We may earn affiliate commissions from qualifying purchases.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
