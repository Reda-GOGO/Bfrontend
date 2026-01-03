import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import Back from "@/components/own/Back";
import VendorCard from "@/components/own/products/VendorCard";
import InventoryCard from "@/components/own/products/InventoryCard";
import MediaCard from "@/components/own/products/MediaCard";
import BasicInfoCard from "@/components/own/products/BasicInfoCard";
import PricingCard from "@/components/own/products/PricingCard";
import SellingUnitsCard from "@/components/own/products/SellingUnitsCard";

import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { productApi } from "@/application/products/api/product.api";
import useProduct from "@/application/products/hooks/useProduct";

export default function UpdateProduct() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { product, setProduct } = useProduct();

  // Load product data by handle
  useEffect(() => {
    if (!handle) return;

    const fetchProduct = async () => {
      try {
        const data = await productApi.getProduct(handle);
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [handle, setProduct]);

  if (!product) return <p>Loading...</p>;

  // Handle form submit
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
      if (product.imageFile instanceof File) {
        formData.append("image", product.imageFile);
      }

      await productApi.updateProduct(handle, formData);

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <Back>
      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46"
      >
        {/* Left Column: Basic info + pricing + variants */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <BasicInfoCard product={product} setProduct={setProduct} />
          <PricingCard
            product={product}
            setProduct={setProduct}
            mode={"update"}
          />
        </div>

        {/* Right Column: Media + inventory + vendor */}
        <div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
          <MediaCard product={product} setProduct={setProduct} />
          <InventoryCard product={product} setProduct={setProduct} />
          <VendorCard product={product} setProduct={setProduct} />
        </div>

        {/* Submit button */}
        <div className="lg:col-span-3 w-full flex justify-end sm:pr-24">
          <Button type="submit" className="mt-6 w-[220px]">
            Update Product
          </Button>
        </div>
      </form>
    </Back>
  );
}
