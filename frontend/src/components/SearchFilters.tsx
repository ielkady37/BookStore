import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  title: string;
  category: string;
  author: string;
  publisher: string;
  isbn: string;
}

const categories = ["Science", "Art", "Religion", "History", "Geography"];

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    title: "",
    category: "",
    author: "",
    publisher: "",
    isbn: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      title: "",
      category: "",
      author: "",
      publisher: "",
      isbn: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl shadow-elegant border border-border/50">
      {/* Main Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={filters.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="pl-12 h-12 text-base bg-background border-border focus:border-primary focus:ring-primary"
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={filters.category}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border animate-fade-in">
          <div className="space-y-2">
            <Label
              htmlFor="isbn"
              className="text-sm font-medium text-muted-foreground"
            >
              ISBN
            </Label>
            <Input
              id="isbn"
              placeholder="978-0..."
              value={filters.isbn}
              onChange={(e) => handleChange("isbn", e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="author"
              className="text-sm font-medium text-muted-foreground"
            >
              Author
            </Label>
            <Input
              id="author"
              placeholder="Author name..."
              value={filters.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="publisher"
              className="text-sm font-medium text-muted-foreground"
            >
              Publisher
            </Label>
            <Input
              id="publisher"
              placeholder="Publisher name..."
              value={filters.publisher}
              onChange={(e) => handleChange("publisher", e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      )}
    </div>
  );
}
