import { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/product.api";
import { useProductsContext } from "../store/products.store";
import { debounce } from "@/lib/utils";
import type { Product } from "@/types";

type PaginationControl = {
  goPrevPage: () => void;
  goNextPage: () => void;
  goFirstPage: () => void;
  goLastPage: () => void;
  hasPrevPage: () => boolean;
  hasNextPage: () => boolean;
  changeLimit: (value: number) => void;
};

function useProductsLoader() {
  const { pagination, search, filter, setProducts, setPagination } =
    useProductsContext();

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 1000),
    [],
  );

  useEffect(() => {
    debounceSearch(search);
  }, [search, debounceSearch]);

  useEffect(() => {
    productApi
      .getProducts({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
        filter_by: filter,
      })
      .then((res) => {
        setProducts(res.products);
        setPagination((prev) => ({
          ...prev,
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
        }));
      });
  }, [pagination.currentPage, pagination.limit, filter, debouncedSearch]);
}

function useProductsPagination() {
  const { pagination, setPagination } = useProductsContext();

  const paginationControl: PaginationControl = {
    goPrevPage: () =>
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      })),
    goNextPage: () =>
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      })),
    goFirstPage: () => setPagination((prev) => ({ ...prev, currentPage: 1 })),
    goLastPage: () =>
      setPagination((prev) => ({ ...prev, currentPage: prev.totalPages })),
    hasPrevPage: () => pagination.currentPage > 1,
    hasNextPage: () => pagination.currentPage < pagination.totalPages,
    changeLimit: (value: number) => {
      setPagination((prev) => ({ ...prev, limit: value, currentPage: 1 }));
    },
  };

  return paginationControl;
}

export function useProductsSelection<T>() {
  const { selected, setSelected } = useProductsContext();
  const handleSelection = (item: T) => {
    setSelected((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }

      return newSet;
    });
  };
  const handleAllSelection = (items: Product[]) => {
    setSelected((prev) => {
      const allOnPageAreSelected = items.every((item) => prev.has(item.id));

      if (allOnPageAreSelected) {
        const newSet = new Set(prev);
        items.forEach((item) => newSet.delete(item.id));
        return newSet;
      } else {
        const newSet = new Set(prev);
        items.forEach((item) => newSet.add(item.id));
        return newSet;
      }
    });
  };

  const isAllItemsSelected = (items: Product[]) => {
    return items.every((item) => selected.has(item.id));
  };

  return {
    selectedItems: [...selected],
    selectedSize: selected.size,
    isItemSelected: (item: T) => selected.has(item),
    isAllItemsSelected,
    handleSelection,
    handleAllSelection,
  };
}
export function useProducts() {
  useProductsLoader();
  const paginationControl = useProductsPagination();
  const { setFilter, pagination, setPagination, setSelected } =
    useProductsContext();

  const filterBy = (value: string): void => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilter(value);
    setSelected(new Set());
  };
  return {
    paginationControl,
    pagination,
    filterBy,
  };
}
