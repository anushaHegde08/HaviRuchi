const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
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

export {
  CATEGORIES,
  DIFFICULTIES,
  ITEMS_PER_PAGE,
  MAX_DESCRIPTION_LENGTH,
  MOBILE_LOAD_COUNT,
  PREVIEW_COUNT,
  RULES,
};
