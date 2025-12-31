import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type PaginationType } from "@/application/products/store/products.store";
type PaginationControlType = {
  goPrevPage: () => void;
  goNextPage: () => void;
  goFirstPage: () => void;
  goLastPage: () => void;
  hasPrevPage: () => boolean;
  hasNextPage: () => boolean;
  changeLimit: (value: number) => void;
};
export default function OrdersPagination({
  paginationControl,
  pagination,
  selectedSize,
}: {
  paginationControl: PaginationControlType;
  pagination: PaginationType;
  selectedSize: number;
}) {
  const {
    goPrevPage,
    goNextPage,
    goFirstPage,
    goLastPage,
    changeLimit,
    hasNextPage,
    hasPrevPage,
  } = paginationControl;
  const { limit, totalCount, currentPage, totalPages } = pagination;
  return (
    <div className="flex w-full text-sm items-center justify-between px-4 py-2">
      <p className="text-muted-foreground @max-[1024px]/main:hidden">
        {selectedSize} of {totalCount} row(s) selected
      </p>

      <div className="flex items-center justify-between lg:gap-16 @max-[1024px]/main:w-full ">
        <div className="flex gap-8 items-center @max-[1024px]/main:hidden ">
          <p>Rows per page</p>

          <Select
            defaultValue={String(limit)}
            onValueChange={(v) => changeLimit(Number(v))}
          >
            <SelectTrigger className="px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex lg:gap-8 items-center @max-[1024px]/main:w-full @max-[1024px]/main:justify-between">
          <p>
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2 ">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!hasPrevPage()}
              onClick={goFirstPage}
            >
              <ChevronsLeft />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0 "
              disabled={!hasPrevPage()}
              onClick={goPrevPage}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0 "
              disabled={!hasNextPage()}
              onClick={goNextPage}
            >
              <ChevronRight />
            </Button>

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!hasNextPage()}
              onClick={goLastPage}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
