import { debounce } from "@/lib/utils";
import type { Order } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { orderApi } from "../api/order.api";

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};

function useOrderLoader({
  orders,
  setOrders,
  search,
  setSearch,
  pagination,
  setPagination,
}: {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  search: string;
  setSearch: (search: string) => void;
  pagination: PaginationType;
  setPagination: (pagination: PaginationType) => void;
}) {
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
    orderApi
      .getOrders({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
        // filter_by: filter,
      })
      .then((res) => {
        setOrders(res.orders);
        setPagination((prev) => ({
          ...prev,
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
        }));
      });
  }, [debouncedSearch, pagination.limit, pagination.currentPage]);
}

function useOrdersPagination({ pagination, setPagination }) {
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

export function useOrdersSelection<T>({ selected, setSelected }) {
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

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5,
  });
  const [selected, setSelected] = useState(new Set());

  useOrderLoader({
    orders,
    setOrders,
    search,
    setSearch,
    pagination,
    setPagination,
  });
  const paginationControl = useOrdersPagination({ pagination, setPagination });

  return {
    search,
    setSearch,
    orders,
    paginationControl,
    pagination,
    selected,
    setSelected,
  };
}
