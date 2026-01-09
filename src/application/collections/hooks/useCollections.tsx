import type { Collection } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { collectionApi } from "../api/collection.api";

export default function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await collectionApi.getCollections();

      setCollections(res.collections || []);
    } catch (err: any) {
      console.error("Failed to fetch collections:", err);
      setError(
        err.message || "Something went wrong while fetching collections.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    refresh: fetchCollections,
  };
}
