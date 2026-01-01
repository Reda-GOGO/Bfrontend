import { genRanHex } from "@/lib/utils";
import type { Product } from "@/types";
import { useState } from "react";

export function useProductLoader({
  product,
  setProduct,
}: { product: Product; setProduct: (product: Product) => void }) { }

export default function useProduct() {
  const generated_handle = genRanHex(16);
  const initialProductState = {
    id: 0,
    name: "",
    handle: generated_handle,
    // image: "/uploads/1758498455862-81372853.webp",
    image: "",
    description: `Description for product with handle : ${generated_handle}`,
    cost: 0,
    price: 0,
    unit: "", // e.g. "kg", "piece"
    vendorName: null,
    vendorContact: null,
    createdAt: new Date(),
    updatedAt: null,
    availableQty: 0,
    archived: false,

    units: [],
    orderItems: [],
    stats: [],
  };
  const [product, setProduct] = useState<Product>(initialProductState);

  return {
    initialProductState,
    product,
    setProduct,
  };
}
