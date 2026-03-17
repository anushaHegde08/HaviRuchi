import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange(pageNumber: number): void;
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={`${currentPage === 1 ? "hover:bg-transparent hover:text-muted-foreground bg-transparent text-muted-foreground" : "hover:bg-primary"}`}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1} onClick={() => onPageChange(i)}>
            <PaginationLink href="#" isActive={i + 1 === currentPage}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={`${currentPage === totalPages ? "hover:bg-transparent hover:text-muted-foreground bg-transparent text-muted-foreground" : "hover:bg-primary"}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default PaginationComponent;
