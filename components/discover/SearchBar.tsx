import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <Field>
      <ButtonGroup>
        <Input
          id="input-button-group"
          className="rounded-s-xl border-secondary"
          placeholder="Discover Recipes (e.g., dosa, idli)"
        />
        <Button variant="outline" className="border-secondary rounded-e-xl">
          <Search />
        </Button>
      </ButtonGroup>
    </Field>
  );
};

export default SearchBar;
