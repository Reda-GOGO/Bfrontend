import type { Order } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { orderApi } from "../api/order.api";
import { debounce } from "@/lib/utils";

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};

export type PrevOrderItemsHook = ReturnType<typeof usePrevOrderItems>;

export function usePrevOrderItems() {
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Map<number, Order>>(new Map());
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // search & pagination 

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
    let isMounted = true;
    setIsLoading(true);

    orderApi
      .getOrders({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
      })
      .then((res) => {
        if (!isMounted) return;
        setOrders((prev) => {
          return pagination.currentPage === 1
            ? res.orders
            : [...prev, ...res.orders];
        });
        setPagination((prev) => ({
          ...prev,
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
        }));
      })
      .finally(() => {
        if (isMounted) delay(2000).then(() => setIsLoading(false));
      });
    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, pagination.limit, debouncedSearch]);

  // selection 

  const addItem = useCallback((order: Order) => {
    setSelected((prev) => {
      if (prev.has(order.id)) return prev;
      return new Map(prev).set(order.id, order);
    });
  },
    [],
  );

  const removeItem = useCallback(
    (orderId: number) => {
      setSelected((prev) => {
        const next = new Map(prev);
        next.delete(orderId);
        return next;
      });
    },
    [],
  );

  const patchItem = useCallback(
    (orderId: number, patch: Partial<Order>) => {
      setSelected((prev) => {
        const existing = prev.get(orderId);
        if (!existing) return prev;
        return new Map(prev).set(orderId, { ...existing, ...patch });
      });
    },
    [],
  );


  const isSelected = useCallback(
    (orderId: number) => {
      return selected.has(orderId);
    },
    [],
  );

  const selectedCount = useMemo(
    () => Array.from(selected.values()).length,
    [selected],
  );


  return {
    search,
    setSearch,
    orders,
    isLoading,
    pagination,
    setPagination,
    selected,
    addItem,
    removeItem,
    patchItem,
    isSelected,
    selectedCount,
  };
}

