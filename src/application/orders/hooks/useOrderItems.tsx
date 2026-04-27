import { productApi } from "@/application/products/api/product.api";
import { debounce } from "@/lib/utils";
import type { OrderItem, Product, ProductUnit } from "@/types";
import { useState, useCallback, useEffect, useMemo } from "react";

export type SelectedItem = {
  product: Product;
  unit: ProductUnit;
  unitLabel: string; // editable display name for the unit
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  verified: boolean;
};

export type OrderItemsHook = ReturnType<typeof useOrderItems>;
export default function useOrderItems() {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [search, setSearch] = useState<string>("");
  const [collectionHandle, setCollectionHandle] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("All Collections");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    totalItems: 0,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 1. Handle Debounce
  const debounceSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 1000),
    [],
  );

  useEffect(() => {
    debounceSearch(search);
  }, [search, debounceSearch]);

  // 2. Reset list when search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setProducts([]); // Clear list for new search
  }, [debouncedSearch, collectionHandle]);

  // 3. Fetch Data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productApi
      .getProducts({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
        collection_handle: collectionHandle,
      })
      .then((res) => {
        if (!isMounted) return;

        setProducts((prev) => {
          // If we are on page 1, replace the list. Otherwise, append.
          return pagination.currentPage === 1
            ? res.products
            : [...prev, ...res.products];
        });

        setPagination((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
          totalItems: res.totalItems,
        }));
      })
      .finally(() => {
        if (isMounted) delay(2000).then(() => setIsLoading(false));
      });

    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, pagination.limit, debouncedSearch, collectionHandle]);

  // 4. Load More helper
  const loadMore = useCallback(() => {
    if (!isLoading && pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [isLoading, pagination.currentPage, pagination.totalPages]);

  // ── Selection ────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Map<number, SelectedItem>>(new Map());

  const addItem = useCallback((product: Product) => {
    const defaultUnit = product.units?.find((u) => u.isBase) ?? product.units?.[0];
    if (!defaultUnit) return;
    setSelected((prev) => {
      if (prev.has(product.id)) return prev;
      return new Map(prev).set(product.id, {
        product,
        unit: defaultUnit,
        unitLabel: defaultUnit.name,
        quantity: 1,
        unitPrice: defaultUnit.price,
        totalAmount: defaultUnit.price,
        verified: false,
      });
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const patchItem = useCallback((productId: number, patch: Partial<SelectedItem>) => {
    setSelected((prev) => {
      const existing = prev.get(productId);
      if (!existing) return prev;
      return new Map(prev).set(productId, { ...existing, ...patch });
    });
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const orderItems: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[] = useMemo(
    () =>
      Array.from(selected.values())
        // .filter((i) => i.verified)
        .map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalAmount: i.totalAmount,
          unitProfit: i.unitPrice - i.unit.cost,
          totalProfit: (i.unitPrice - i.unit.cost) * i.quantity,
          unit: i.unitLabel,
          productUnitId: i.unit.id,
          productId: i.product.id,
          product: i.product,
        })),
    [selected]
  );

  const totalAmount = useMemo(
    () => Array.from(selected.values()).reduce((s, i) => s + i.totalAmount, 0),
    [selected]
  );

  const hasUnverified = useMemo(
    () => Array.from(selected.values()).some((i) => !i.verified),
    [selected]
  );
  return {
    search,
    setSearch,
    collectionHandle,
    setCollectionHandle,
    collectionName,
    setCollectionName,
    pagination,
    products,
    isLoading,
    loadMore,
    selected, addItem, removeItem, patchItem,
    orderItems, totalAmount, hasUnverified,
    selectedCount: selected.size,
    hasMore: pagination.currentPage < pagination.totalPages,
  };
} 
