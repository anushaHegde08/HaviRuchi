import { RecipeItem } from "@/types";

export const totalPages = (recipes: RecipeItem[], itemsPerPage: number) => {
  return Math.ceil(recipes.length / itemsPerPage);
};

export const formatTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const hourLabel = hours === 1 ? "Hour" : "Hours";
  const minLabel = mins === 1 ? "Min" : "Mins";
  if (hours === 0) return `${mins} ${minLabel}`;
  if (mins === 0) return `${hours} ${hourLabel}`;
  return `${hours}H ${mins}M`;
};

export const capitalizeFirst = (value: string) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const scaleIngredients = (
  ingredients: string[],
  originalServings: number,
  targetServings: number
): string[] => {
  if (originalServings === targetServings || originalServings <= 0) {
    return ingredients;
  }
  
  const ratio = targetServings / originalServings;
  
  return ingredients.map(ingredient => {
    // Current schema stores ingredients as "Name - Measurement"
    const parts = ingredient.split(" - ");
    if (parts.length < 2) return ingredient; // No measurement found
    
    const name = parts[0];
    const measurement = parts[1];
    
    // Naive scaling: look for leading number (including decimals and fractions)
    const match = measurement.trim().match(/^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*(.*)/);
    
    if (match) {
      const quantityStr = match[1];
      const rest = match[2];
      
      let numericValue = 0;
      if (quantityStr.includes('/')) {
        const fracParts = quantityStr.split(' ');
        if (fracParts.length === 2) {
          const [whole, frac] = fracParts;
          const [num, den] = frac.split('/');
          numericValue = parseInt(whole) + parseInt(num) / parseInt(den);
        } else {
          const [num, den] = quantityStr.split('/');
          numericValue = parseInt(num) / parseInt(den);
        }
      } else {
        numericValue = parseFloat(quantityStr);
      }
      
      const scaledValue = numericValue * ratio;
      // Round to 2 decimals max to avoid floating point issues
      const formattedValue = Number.isInteger(scaledValue) 
        ? scaledValue.toString() 
        : Number(scaledValue.toFixed(2)).toString(); // Will strip trailing zeros naturally after converting to Number
        
      return `${name} - ${formattedValue} ${rest}`.trim();
    }
    
    // If no leading number, return original
    return ingredient;
  });
};
