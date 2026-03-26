"use client";
import { FilterState } from "@/types/filter";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { FilterSlider } from "./FilterSlider";
import { CATEGORIES, DIFFICULTIES } from "@/mockData/constatnts";
import { Button } from "@/components/ui/button";

interface FilterBodyProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  // onApply: () => void;
  // onClear: () => void;
}

export const FilterBody = ({
  filters,
  onChange,
  // onApply,
  // onClear,
}: FilterBodyProps) => (
  <div className="flex flex-col md:flex-row justify-between">
    <FilterCheckboxGroup
      title="Category"
      items={CATEGORIES}
      selected={filters.categories}
      onChange={(categories) => onChange({ ...filters, categories })}
      className="md:hidden"
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
  </div>
);
