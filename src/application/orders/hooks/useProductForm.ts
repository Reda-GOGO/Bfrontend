import { productApi } from "@/application/products/api/product.api";
import { debounce } from "@/lib/utils";
import type { Product, ProductUnit, OrderItem } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type SelectedItem = {
  product: Product;
  unit: ProductUnit;
  unitLabel: string; // editable display name for the unit
  quantity: number;
  unitPrice: number;
  verified: boolean;
};

export type ProductFormHook = ReturnType<typeof useProductForm>;

export function useProductForm() {
  // ── Search & pagination ──────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceSearch = useMemo(
    () => debounce((v: string) => setDebouncedSearch(v), 400),
    []
  );

  useEffect(() => { debounceSearch(search); }, [search, debounceSearch]);

  // Reset on new search term
  useEffect(() => {
    setPagination((p) => ({ ...p, currentPage: 1 }));
    setProducts([]);
  }, [debouncedSearch]);

  // Fetch
  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    productApi
      .getProducts({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
      })
      .then((res) => {
        if (!alive) return;
        setProducts((prev) =>
          pagination.currentPage === 1
            ? res.products
            : [...prev, ...res.products]
        );
        setPagination((p) => ({
          ...p,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
        }));
      })
      .finally(() => { if (alive) setIsLoading(false); });
    return () => { alive = false; };
  }, [pagination.currentPage, pagination.limit, debouncedSearch]);

  const loadMore = useCallback(() => {
    if (!isLoading && pagination.currentPage < pagination.totalPages) {
      setPagination((p) => ({ ...p, currentPage: p.currentPage + 1 }));
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
        .filter((i) => i.verified)
        .map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalAmount: i.quantity * i.unitPrice,
          unitProfit: i.unitPrice - i.unit.cost,
          totalProfit: (i.unitPrice - i.unit.cost) * i.quantity,
          unit: i.unitLabel,
          productUnitId: i.unit.id,
          productId: i.product.id,
        })),
    [selected]
  );

  const totalAmount = useMemo(
    () => Array.from(selected.values()).reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    [selected]
  );

  const hasUnverified = useMemo(
    () => Array.from(selected.values()).some((i) => !i.verified),
    [selected]
  );

  return {
    search, setSearch,
    products, isLoading, pagination,
    loadMore,
    hasMore: pagination.currentPage < pagination.totalPages,
    selected, addItem, removeItem, patchItem,
    orderItems, totalAmount, hasUnverified,
    selectedCount: selected.size,
  };
}
