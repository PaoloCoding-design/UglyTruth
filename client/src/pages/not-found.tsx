import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Page not found
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <Link href="/">
            <Button size="lg" data-testid="button-go-home">
              Return Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
