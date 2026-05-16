import { Card } from "../ui/card";

export const RecipeCardSkeleton = () => (
  <Card className="flex overflow-hidden animate-pulse">
    <div className="w-48 h-48 bg-muted" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-2/3" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-16 bg-muted rounded-full" />
        <div className="h-6 w-16 bg-muted rounded-full" />
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
