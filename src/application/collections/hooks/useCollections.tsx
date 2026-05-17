import type { Collection } from "@/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import { collectionApi } from "../api/collection.api";
import { debounce } from "@/lib/utils";
type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};

export type CollectionsHook = ReturnType<typeof useCollections>;

export default function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5,
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


  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    collectionApi
      .getCollections({
        search: debouncedSearch,
        page: pagination.currentPage,
        limit: pagination.limit,
        filter_by: filter,
      })
      .then((res) => {
        if (!isMounted) return;
        setCollections(
          res.collections ? res.collections : []
        );
        setPagination((prev) => ({
          ...prev,
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalCount: res.totalCount,
        }));

      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        if (isMounted) {
          // new Promise((resolve) => setTimeout(resolve, 3000))
          //   .then(() => setLoading(false));
          setLoading(false);
        };
      });
    () => {
      isMounted = false;
    }
  }, [debouncedSearch, pagination.currentPage, pagination.limit, filter]);



  const loadMore = useCallback(() => {
    if (!isLoading && pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [loading, pagination.currentPage, pagination.totalPages]);

  // ── Selection ────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Map<number, Collection>>(new Map());

  const addItem = useCallback((collection: Collection) => {
    setSelected((prev) => {
      if (prev.has(collection.id)) return prev;
      return new Map(prev).set(collection.id, collection);
    });
  },
    [],
  );

  const removeItem = useCallback(
    (collectionId: number) => {
      setSelected((prev) => {
        const next = new Map(prev);
        next.delete(collectionId);
        return next;
      });
    },
    [],
  );

  const patchItem = useCallback(
    (collectionId: number, patch: Partial<Collection>) => {
      setSelected((prev) => {
        const existing = prev.get(collectionId);
        if (!existing) return prev;
        return new Map(prev).set(collectionId, { ...existing, ...patch });
      });
    },
    [],
  );


  const isSelected = useCallback(
    (collectionId: number) => {
      return selected.has(collectionId);
    },
    [],
  );

  const selectedCount = useMemo(
    () => Array.from(selected.values()).length,
    [selected],
  );

  return {
    collections,
    search,
    setSearch,
    filter,
    setFilter,
    loading,
    error,
    pagination,
    setPagination,
    selected,
    addItem,
    removeItem,
    patchItem,
    isSelected,
    selectedCount,
    hasMore: pagination.currentPage < pagination.totalPages,
  };
}
