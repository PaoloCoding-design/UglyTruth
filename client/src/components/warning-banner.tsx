import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  message?: string;
}

export function WarningBanner({ 
  message = "This page focuses on drawbacks only. For complete product reviews, please visit the manufacturer's website."
}: WarningBannerProps) {
  return (
    <div className="w-full bg-muted border-y" data-testid="banner-warning">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">
          <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
