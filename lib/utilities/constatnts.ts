const CATEGORIES = [
  "All",
  "Breakfast",
  "Main Course",
  "Sides",
  "Snack",
  "Sweets",
  "Beverage",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const ITEMS_PER_PAGE = 10;

const MOBILE_LOAD_COUNT = 4;

const RULES = [
  { label: "Atleast 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  {
    label: "Contains a special character(@,#,$,%,&,*)",
    test: (p: string) => /[@#$%&*]/.test(p),
  },
];

const PREVIEW_COUNT = 5;

const MAX_DESCRIPTION_LENGTH = 250;
const MAX_RECIPE_TITLE_LENGTH = 30;

export {
  CATEGORIES,
  DIFFICULTIES,
  ITEMS_PER_PAGE,
  MAX_DESCRIPTION_LENGTH,
  MAX_RECIPE_TITLE_LENGTH,
  MOBILE_LOAD_COUNT,
  PREVIEW_COUNT,
  RULES,
};
