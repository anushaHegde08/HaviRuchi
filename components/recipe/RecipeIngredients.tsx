"use client";
import { PREVIEW_COUNT } from "@/mockData/constatnts";
import { useState } from "react";

export const RecipeIngredients = ({
  ingredients,
}: {
  ingredients: string[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ingredients : ingredients.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-primary">Ingredients</h2>
      <ol className="flex flex-col gap-2 list-decimal list-inside">
        {visible.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed">
            {item}
          </li>
        ))}
      </ol>
      {ingredients.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary hover:underline text-left w-fit"
        >
          {showAll ? "show less" : "more"}
        </button>
      )}
    </div>
  );
};
