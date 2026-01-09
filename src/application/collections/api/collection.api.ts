import { http } from "@/infrastructure/api/http";
import type { Collection } from "@/types";

interface CollectionResponse {
  collections: Collection[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const collectionApi = {
  getCollections(params: {
    page?: number;
    search?: string;
    limit?: number;
    filter_by?: string;
  }) {
    return http.get<CollectionResponse>("/collection", params);
  },

  getCollection(handle: string) {
    return http.get<Collection>(`/collection/${handle}`);
  },

  createCollection(data: FormData) {
    return http.post("/collection", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCollection(handle: string, data: Partial<Collection>) {
    return http.put(`/collection/${handle}`, data);
  },

  deleteCollection(id: string) {
    return http.delete(`/collection/${id}`);
  },
};
