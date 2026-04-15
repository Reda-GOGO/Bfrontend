import { collectionApi } from "@/application/collections/api/collection.api";
import { productApi } from "@/application/products/api/product.api";
import { debounce } from "@/lib/utils";
import { OrderEnum, type Order, type Product } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export const EMPTY_ORDER: Order = {
  totalAmount: 0,
  discount: 0,
  profit: 0,
  partiallyPaidIn: 0,
  totalAmountString: "",
  status: OrderEnum.PENDING, // Using your defined enum
  type: "facture", // Or whatever your default type is
  orderRef: "",
  paymentRef: "",
  paymentMode: "",
  customerId: 0,
  createdBy: 0,
  archived: false,
  items: [], // Empty array for OrderItems
  tax: 0.2,
  totalAmountWithTax: 0,
};

export function useOrderProductLoader({ search, collectionHandle }: { search: string; collectionHandle?: string }) {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
        collection_handle: collectionHandle ? collectionHandle : "",
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

  return {
    products,
    pagination,
    isLoading,
    loadMore,
    hasMore: pagination.currentPage < pagination.totalPages,
  };
}

export function useOrderCollectionLoader() {
  const [collections, setCollections] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    collectionApi
      .getCollections({})
      .then((res) => {
        setCollections(res.collections || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    collections,
    isLoading,
  };
}

export default function useOrder() {
  const [order, setOrder] = useState<Order>(EMPTY_ORDER);

  return {
    order,
    setOrder,
  };
}
