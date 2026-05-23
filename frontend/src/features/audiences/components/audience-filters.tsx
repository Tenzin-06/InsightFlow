import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIENCE_SORT_OPTIONS } from "@/features/audiences/constants";
import type { AudienceSortKey } from "@/features/audiences/types";

type Props = {
  search: string;
  sort: AudienceSortKey;
  onSearchChange: (value: string) => void;
  onSortChange: (value: AudienceSortKey) => void;
};

export function AudienceFilters({ search, sort, onSearchChange, onSortChange }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search audiences..."
          className="h-9 bg-white pl-9 dark:bg-card"
        />
      </div>
      <Select value={sort} onValueChange={(value) => onSortChange(value as AudienceSortKey)}>
        <SelectTrigger className="h-9 w-full bg-white sm:w-44 dark:bg-card">
          <SelectValue placeholder="Sort audiences" />
        </SelectTrigger>
        <SelectContent>
          {AUDIENCE_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-card">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}
