import { http } from "@/infrastructure/api/http";
import type { Product } from "@/types";

interface ProductResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const productApi = {
  getProducts(params: {
    page?: number;
    search?: string;
    limit?: number;
    filter_by?: string;
  }) {
    return http.get<ProductResponse>("/product", params);
  },

  getProduct(id: string) {
    return http.get<Product>(`/product/${id}`);
  },

  createProduct(data: Partial<Product>) {
    return http.post("/product", data);
  },

  updateProduct(id: string, data: Partial<Product>) {
    return http.put(`/product/${id}`, data);
  },

  archiveProduct(id: string) {
    return http.put(`/product/${id}/archive`);
  },

  deleteProduct(id: string) {
    return http.delete(`/product/${id}`);
  },
};
