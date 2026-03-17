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

const TIME_LABELS = ["15M", "30M", "45M", "1H", "1H+"];

const ITEMS_PER_PAGE = 6;

const RULES = [
  { label: "Atleast 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  {
    label: "Contains a special character(@,#,$,%,&,*)",
    test: (p: string) => /[@#$%&*]/.test(p),
  },
];

const PREVIEW_COUNT = 5;

export {
  CATEGORIES,
  DIFFICULTIES,
  TIME_LABELS,
  ITEMS_PER_PAGE,
  RULES,
  PREVIEW_COUNT,
};
