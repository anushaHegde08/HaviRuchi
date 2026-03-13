import FilterContent from "@/components/filter/FilterContent";
import { useGlobalContext } from "@/context";
import React from "react";

const FilterScreen = () => {
  const { filterOpen, setFilterOpen } = useGlobalContext();

  return <div>{filterOpen && <FilterContent />}</div>;
};

export default FilterScreen;
