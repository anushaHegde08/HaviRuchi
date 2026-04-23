import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Field>
      <ButtonGroup>
        <Input
          id="input-button-group"
          className="rounded-s-xl border-secondary"
          placeholder="Discover Recipes (e.g., dosa, idli)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="border border-secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button variant="outline" className="border-secondary rounded-e-xl">
          <Search />
        </Button>
      </ButtonGroup>
    </Field>
  );
};

export default SearchBar;
