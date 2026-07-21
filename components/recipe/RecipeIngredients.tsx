"use client";
import { PREVIEW_COUNT } from "@/lib/utilities/constatnts";
import { capitalizeFirst } from "@/lib/utilities/helperFunction";
import { Ingredient } from "@/types";
import { useState } from "react";

const renderQuantity = (qty: number | null) => {
  if (qty === null) return "";
  
  const integerPart = Math.floor(qty);
  const decimalPart = qty - integerPart;
  
  let decimalStr = "";
  if (Math.abs(decimalPart - 0.5) < 0.01) decimalStr = "½";
  else if (Math.abs(decimalPart - 0.25) < 0.01) decimalStr = "¼";
  else if (Math.abs(decimalPart - 0.33) < 0.01) decimalStr = "⅓";
  else if (Math.abs(decimalPart - 0.66) < 0.01) decimalStr = "⅔";
  else if (Math.abs(decimalPart - 0.75) < 0.01) decimalStr = "¾";
  else if (decimalPart > 0) decimalStr = decimalPart.toString().substring(1); // like .12

  const fractionSymbols = ["½", "¼", "⅓", "⅔", "¾"];
  
  if (integerPart > 0 && decimalStr && fractionSymbols.includes(decimalStr)) {
     return `${integerPart} ${decimalStr}`;
  }
  if (integerPart === 0 && decimalStr && fractionSymbols.includes(decimalStr)) {
     return decimalStr;
  }
  return qty.toString();
};

const renderIngredient = (ing: Ingredient) => {
  const name = capitalizeFirst(ing.name);
  if (ing.quantity === null) {
    if (ing.unit === "to taste") return `${name} - to taste`;
    return `${name} - ${ing.unit}`;
  }
  
  const qtyStr = renderQuantity(ing.quantity);
  let displayUnit = ing.unit;
  
  if (ing.quantity > 1) {
    const pluralize = ["cup", "tbsp", "tsp", "piece", "sprig", "clove", "leaf", "handful", "inch"];
    if (pluralize.includes(ing.unit)) {
      if (ing.unit === "leaf") displayUnit = "leaves";
      else if (ing.unit === "inch") displayUnit = "inches";
      else displayUnit += "s";
    }
  }
  
  if (displayUnit === "whole") {
     return `${name} - ${qtyStr}`.trim();
  }
  
  return `${name} - ${qtyStr} ${displayUnit}`.trim();
};

export const RecipeIngredients = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ingredients : ingredients.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl lg:text-2xl font-bold text-primary">
        Ingredients
      </h2>
      <ol className="flex flex-col gap-2 list-decimal list-inside">
        {visible.map((item, i) => (
          <li
            key={i}
            className="text-sm md:text-base lg:text-lg leading-relaxed"
          >
            {renderIngredient(item)}
          </li>
        ))}
      </ol>
      {ingredients.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm md:text-base lg:text-lg text-primary hover:underline text-left w-fit"
        >
          {showAll ? "show less" : "more"}
        </button>
      )}
    </div>
  );
};
