import { productApi } from "@/application/products/api/product.api";
import useProduct from "@/application/products/hooks/useProduct";
import Back from "@/components/own/Back";
import BasicInfoCard from "@/components/own/products/BasicInfoCard";
import InventoryCard from "@/components/own/products/InventoryCard";
import MediaCard from "@/components/own/products/MediaCard";
import PricingCard from "@/components/own/products/PricingCard";
import SellingUnitsCard from "@/components/own/products/SellingUnitsCard";
import VendorCard from "@/components/own/products/VendorCard";
import { Button } from "@/components/ui/button";
import type { ProductUnit } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router";

// function CreateProductAlert() {
//   return (
//     <div className="flex flex-row gap-2">
//       <Button variant="secondary" className="max-sm:w-24 w-full capitalize">
//         discard
//       </Button>
//       <Button className="max-sm:w-24 w-full capitalize">save</Button>
//     </div>
//   );
// }

import { toast } from "sonner";

export default function Create() {
  const { product, setProduct, initialProductState } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // primitive fields
      formData.append("name", product.name);
      formData.append("handle", product.handle);
      formData.append("description", product.description || "");
      formData.append("cost", String(product.cost));
      formData.append("price", String(product.price));
      formData.append("unit", product.unit);
      formData.append("vendorName", product.vendorName || "");
      formData.append("vendorContact", product.vendorContact || "");
      formData.append("availableQty", String(product.availableQty || 0));

      // 🔥 units MUST be stringified
      formData.append("units", JSON.stringify(product.units || []));

      // optional image
      if (product.image instanceof File) {
        formData.append("image", product.image);
      }

      await productApi.createProduct(formData);

      toast.success("Product created successfully");
      navigate("/products");
      setProduct(initialProductState);
    } catch (error) {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    }
  };

  return (
    <Back>
      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46"
      >
        <div className="lg:col-span-2 flex flex-col gap-2">
          <BasicInfoCard product={product} setProduct={setProduct} />
          <PricingCard
            product={product}
            setProduct={setProduct}
            mode={"create"}
          />
        </div>

        <div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
          <MediaCard product={product} setProduct={setProduct} />
          <InventoryCard product={product} setProduct={setProduct} />
          <VendorCard product={product} setProduct={setProduct} />
        </div>

        <div className="lg:col-span-3 w-full flex justify-end sm:pr-24">
          <Button type="submit" className="mt-6 w-[220px]">
            Save Product
          </Button>
        </div>
      </form>
    </Back>
  );
}
