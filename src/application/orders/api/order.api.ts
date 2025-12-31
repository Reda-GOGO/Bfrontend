import { http } from "@/infrastructure/api/http";
import type { Order } from "@/types";

interface OrderResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const orderApi = {
  getOrders(params: {
    page?: number;
    search?: string;
    limit?: number;
    filter_by?: string;
  }) {
    return http.get<OrderResponse>("/orders", params);
  },

  getOrder(id: string) {
    return http.get<Order>(`/orders/${id}`);
  },

  createOrder(data: Partial<Order>) {
    return http.post("/orders", data);
  },

  updateOrder(id: string, data: Partial<Order>) {
    return http.put(`/orders/${id}`, data);
  },

  archiveOrder(id: string) {
    return http.put(`/orders/${id}/archive`);
  },

  deleteOrder(id: string) {
    return http.delete(`/orders/${id}`);
  },
};
