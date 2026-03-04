import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon } from "lucide-react";

const SearchBar = () => {
  return (
    <InputGroup className="rounded-xl border-secondary">
      <InputGroupInput placeholder="Discover Recipes..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
