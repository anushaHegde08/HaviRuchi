import { Card } from "../ui/card";

export const RecipeCardSkeleton = () => (
  <Card className="grid grid-cols-6 gap-2 animate-pulse">
    {/* Image placeholder - matches col-span-2 */}
    <div className="col-span-2 h-[100px] md:h-[190px] bg-muted rounded-s-xl" />
    
    {/* Content placeholder - matches col-span-4 */}
    <div className="col-span-4 py-2 flex flex-col justify-between pr-2">
      {/* Title */}
      <div className="h-3 bg-muted rounded w-3/4 mb-2" />
      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="h-2.5 bg-muted rounded w-full" />
        <div className="h-2.5 bg-muted rounded w-5/6" />
        <div className="h-2.5 bg-muted rounded w-4/6" />
      </div>
      {/* Badges */}
      <div className="flex gap-1.5 mt-2">
        <div className="h-4 w-14 bg-muted rounded-full" />
        <div className="h-4 w-12 bg-muted rounded-full" />
        <div className="h-4 w-10 bg-muted rounded-full" />
      </div>
    </div>
  </Card>
);

export const RecipeGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <RecipeCardSkeleton key={i} />
    ))}
  </div>
);
