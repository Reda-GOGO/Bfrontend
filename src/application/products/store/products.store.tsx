import type { Product } from "@/types";
import { createContext, useContext, useState } from "react";
import React from "react";

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};
export type FilterType = "all" | "active" | "archived";

type ProductsContextType = {
  search: string;
  setSearch: (search: string) => void;
  isSearch: boolean;
  setIsSearch: (isSeach: boolean) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  pagination: PaginationType;
  setPagination: (pagination: PaginationType) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  selected: Set<number>;
  setSelected: (selected: Set<number>) => void;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  const [selected, setSelected] = useState(new Set<T>());

  const value = {
    search,
    setSearch,
    isSearch,
    setIsSearch,
    products,
    setProducts,
    pagination,
    setPagination,
    filter,
    setFilter,
    selected,
    setSelected,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      "useProductsContext must be used within an ProductsProvider",
    );
  }
  return context;
};
