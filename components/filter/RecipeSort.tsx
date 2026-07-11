import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/types/filter";

interface RecipeSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const RecipeSort = ({ value, onChange }: RecipeSortProps) => {
  return (
    <div className="border-t pt-6">
      <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
        Sort By
      </p>
      <Select 
        value={value || "newest"} 
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full md:w-[280px]">
          <SelectValue placeholder="Sort recipes by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest (default)</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="time_asc">Cooking Time (Low → High)</SelectItem>
          <SelectItem value="time_desc">Cooking Time (High → Low)</SelectItem>
          <SelectItem value="difficulty_asc">Difficulty (Easy → Hard)</SelectItem>
          <SelectItem value="difficulty_desc">Difficulty (Hard → Easy)</SelectItem>
          <SelectItem value="alpha_asc">Alphabetical (A → Z)</SelectItem>
          <SelectItem value="alpha_desc">Alphabetical (Z → A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
