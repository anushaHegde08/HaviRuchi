"use client";
import { FilterState } from "@/types/filter";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { FilterSlider } from "./FilterSlider";
import { CATEGORIES, DIFFICULTIES } from "@/mockData/constatnts";
import { Button } from "@/components/ui/button";

interface FilterBodyProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export const FilterBody = ({
  filters,
  onChange,
  onApply,
  onClear,
}: FilterBodyProps) => (
  <div className="flex flex-col gap-6">
    <FilterCheckboxGroup
      title="Category"
      items={CATEGORIES}
      selected={filters.categories}
      onChange={(categories) => onChange({ ...filters, categories })}
    />
    <FilterCheckboxGroup
      title="Difficulty"
      items={DIFFICULTIES}
      selected={filters.difficulties}
      onChange={(difficulties) => onChange({ ...filters, difficulties })}
    />
    <FilterSlider
      value={filters.maxTime}
      onChange={(maxTime) => onChange({ ...filters, maxTime })}
    />
    <div className="flex gap-3 pt-2">
      <Button
        variant="outline"
        className="flex-1 rounded-xl border-primary text-primary hover:bg-primary/5"
        onClick={onClear}
      >
        Clear Filters
      </Button>
      <Button className="flex-1 rounded-xl" onClick={onApply}>
        Apply Filters
      </Button>
    </div>
  </div>
);
