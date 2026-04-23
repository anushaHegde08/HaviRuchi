import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useRef, useCallback } from "react";
import { RecipeItem } from "@/types";

interface PaginationComponentProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  allFilteredRecipes: RecipeItem[];
  visibleItems: RecipeItem[];
  onLoadMore: () => void;
}

const PaginationComponent = ({
  totalPages,
  currentPage,
  onPageChange,
  allFilteredRecipes,
  visibleItems,
  onLoadMore,
}: PaginationComponentProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  // infinite scroll observer — mobile only
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        visibleItems.length < allFilteredRecipes.length
      ) {
        onLoadMore();
      }
    },
    [visibleItems.length, allFilteredRecipes.length, onLoadMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  return (
    <>
      <div className="hidden md:block">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  !isFirst && onPageChange(currentPage - 1);
                }}
                className={
                  isFirst
                    ? "pointer-events-none opacity-50 cursor-default"
                    : "cursor-pointer hover:bg-primary hover:text-white"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i} onClick={() => onPageChange(i)}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i);
                  }}
                  isActive={i === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  !isLast && onPageChange(currentPage + 1);
                }}
                className={
                  isLast
                    ? "pointer-events-none opacity-50 cursor-default"
                    : "cursor-pointer hover:bg-primary hover:text-white"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Mobile infinite scroll — hidden on desktop */}
      <div ref={observerRef} className="md:hidden py-4 text-center">
        {visibleItems.length < allFilteredRecipes.length ? (
          <p className="text-sm text-muted-foreground">Loading more...</p>
        ) : (
          <p className="text-sm text-muted-foreground">No more recipes</p>
        )}
      </div>
    </>
  );
};
export default PaginationComponent;
