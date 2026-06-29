export const categoryDefaultImages: Record<string, string> = {
  Breakfast:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643595/breakfast_hkn3l8.png",
  Lunch:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643592/lunch_krfewy.png",
  Dinner:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643595/dinner_pjpmbi.png",
  Snack:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643599/snacks_ztbghn.png",
  Dessert:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782681010/desserts_alxhlb.png",
  Beverage:
    "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643596/beverages_uyb3d0.png",
};

export const defaultFallbackImage =
  "https://res.cloudinary.com/damgpjmeb/image/upload/v1782643559/default_nhzopc.png";

export const getRecipeImage = (image: string, category: string) => {
  if (image && image.trim() !== "") return image;
  return categoryDefaultImages[category] || defaultFallbackImage;
};
