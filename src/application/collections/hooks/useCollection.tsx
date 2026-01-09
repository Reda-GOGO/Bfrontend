import { productApi } from "@/application/products/api/product.api";
import { debounce, genRanHex } from "@/lib/utils";
import type { Collection, Product } from "@/types";
import { useState, useCallback, useEffect, useMemo } from "react";
import { collectionApi } from "../api/collection.api";

export const createInitialState = (name = ""): Collection => {
  const handle = genRanHex(24);
  return {
    id: 0,
    name: name,
    handle: handle,
    description: `Description for Collection: ${name}, with handle: ${handle}`,
    products: [], // This will hold our full product objects
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

function useCollectionProductLoader({ search }: { search: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
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
  }, [debouncedSearch]);

  // 3. Fetch Data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productApi
      .getProducts({
        page: pagination.currentPage,
        search: debouncedSearch,
        limit: pagination.limit,
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
        }));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, pagination.limit, debouncedSearch]);

  // 4. Load More helper
  const loadMore = useCallback(() => {
    if (!isLoading && pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [isLoading, pagination.currentPage, pagination.totalPages]);

  return {
    products,
    pagination,
    isLoading,
    loadMore,
    hasMore: pagination.currentPage < pagination.totalPages,
  };
}

export function useCollectionDetail(handle: string | undefined) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!handle) return;

    try {
      setLoading(true);
      setError(null);

      const res = await collectionApi.getCollection(handle);
      setCollection(res);
    } catch (err: any) {
      console.error("Failed to fetch collection detail:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while fetching the collection.",
      );
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    collection,
    loading,
    error,
    refresh: fetchDetail,
  };
}

export default function useCollection() {
  const [collection, setCollection] = useState<Collection>(
    createInitialState(),
  );
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const updateName = (newName: string) => {
    setCollection((prev) => ({
      ...prev,
      name: newName,
      description: `Description for Collection: ${newName}, with handle: ${prev.handle}`,
    }));
  };

  const { products, pagination, setPagination, isLoading, hasMore, loadMore } =
    useCollectionProductLoader({
      search,
    });
  /**
   * Toggles a product in the collection.
   * If the product is already there, it removes it.
   * If not, it adds the full product object so the UI can display its info.
   */
  const toggleProduct = (product: Product) => {
    setCollection((prev) => {
      const products = prev.products || [];
      const isAlreadySelected = products.some((p) => p.id === product.id);

      if (isAlreadySelected) {
        // Remove the product
        return {
          ...prev,
          products: products.filter((p) => p.id !== product.id),
        };
      } else {
        // Add the full product object
        return {
          ...prev,
          products: [...products, product],
        };
      }
    });
  };

  // Helper to check if a specific ID is selected (useful for UI styling in search)
  const isProductSelected = (productId: number) => {
    return collection.products?.some((p) => p.id === productId) ?? false;
  };

  const reset = useCallback(() => {
    setCollection(createInitialState());
  }, []);

  return {
    collection,
    products,
    error,
    isLoading, // Export these for UI
    hasMore,
    loadMore,
    setCollection,
    search,
    setSearch,
    updateName,
    toggleProduct,
    isProductSelected,
    reset,
  };
}
