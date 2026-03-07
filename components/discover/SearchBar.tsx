import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search, SearchIcon } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex w-full items-center">
      <InputGroup className="rounded-s-xl border-secondary flex-1">
        <InputGroupInput placeholder="Discover Recipes (e.g., dosa, idli)" />
      </InputGroup>
      <Button className="rounded-e-xl -ml-0.4">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBar;
