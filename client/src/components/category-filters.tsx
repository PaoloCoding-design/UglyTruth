
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";

interface CategoryFiltersProps {
  brands: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  selectedBrands: string[];
  priceRange: [number, number];
}

export function CategoryFilters({ brands, onFilterChange }: CategoryFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFilterChange({ searchQuery: value, selectedBrands, priceRange });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    onFilterChange({ searchQuery, selectedBrands: newBrands, priceRange });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onFilterChange({ searchQuery, selectedBrands, priceRange: newRange });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    onFilterChange({ searchQuery: "", selectedBrands: [], priceRange: [0, 5000] });
  };

  const hasActiveFilters = searchQuery || selectedBrands.length > 0 || 
    priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-ugly-red hover:text-ugly-red"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search by Name/Model */}
      <div className="space-y-2">
        <Label htmlFor="filter-search">Search by Name or Model</Label>
        <Input
          id="filter-search"
          placeholder="e.g., MacBook Pro, RTX 4090..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filter by Brand */}
      <Collapsible open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="cursor-pointer">Brand</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Filter by Price Range */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="cursor-pointer">Price Range</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
