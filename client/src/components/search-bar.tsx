import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  size?: "default" | "large";
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  size = "default", 
  placeholder = "Search for a product...",
  className = ""
}: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${isLarge ? "h-5 w-5" : "h-4 w-4"}`} />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${isLarge ? "h-14 text-lg pl-12 pr-32 rounded-full" : "h-10 pl-10 pr-20 rounded-lg"}`}
          data-testid="input-search-main"
        />
        <Button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${isLarge ? "rounded-full px-6" : "rounded-md px-4"}`}
          size={isLarge ? "default" : "sm"}
          data-testid="button-search-submit"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
