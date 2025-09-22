import Back from "@/components/own/Back";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  BasicInfoCard,
  InventoryCard,
  MediaCard,
  PricingCard,
  SellingUnitsCard,
  VendorCard,
} from "./CreateProduct.tsx";

import { toast } from "sonner";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ChartBarHorizontal } from "@/components/own/charts/myBarChart.tsx";
import { ChartRadialText } from "@/components/own/charts/myRadialChart.tsx";

interface UpdateProductProps {
  productId: number;
}

export default function Update() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    price: 1,
    cost: 0,
    profit: 0,
    margin: 0,
    baseUnit: { name: "", price: "" },
    units: [] as { name: string; price: string; conversion: string }[],
    inventoryUnit: "", // fetch inventory if needed
    inventoryQuantity: 0, // fetch inventory if needed
    vendor: { name: "", contact: "" },
    image: null as File | null,
    imagePreview: "",
    existingImage: "", // store existing image URL
  });
  const { title } = useParams();
  const productId = parseInt(title);
  // Fetch product by ID and populate form
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/${productId}`,
        );
        const data = await res.json();

        setFormData({
          title: data.name,
          handle: data.handle,
          description: data.description,
          price: data.price,
          cost: data.cost,
          profit: data.price - data.cost,
          margin: ((data.price - data.cost) / data.price) * 100,
          baseUnit: { name: data.unit, price: data.price },
          units: data.units.map((u: any) => ({
            name: u.name,
            price: u.price,
            conversion: u.quantityInBase,
          })),
          inventoryUnit: data?.inventoryUnit,
          inventoryQuantity: data.inventoryQuantity,
          vendor: {
            name: data.vendorName || "",
            contact: data.vendorContact || "",
          },
          image: null,
          imagePreview: data.image
            ? `${import.meta.env.VITE_API_URL}${data.image}`
            : "",
          existingImage: data.image || "",
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    // append new image only if selected
    if (formData.image) form.append("image", formData.image);

    form.append("name", formData.title);
    form.append("handle", formData.handle);
    form.append("description", formData.description);
    form.append("cost", String(formData.cost));
    form.append("price", String(formData.price));
    form.append("unit", formData.baseUnit.name);
    form.append("vendorName", formData.vendor.name);
    form.append("vendorContact", formData.vendor.contact);

    form.append(
      "units",
      JSON.stringify(
        formData.units.map((u) => ({
          name: u.name,
          price: Number(u.price),
          quantityInBase: Number(u.conversion),
        })),
      ),
    );

    form.append("inventoryUnit", formData.inventoryUnit);
    form.append("inventoryQuantity", formData.inventoryQuantity);

    // form.append(
    //   "inventory",
    //   JSON.stringify({
    //     unit: formData.inventory.unit,
    //     quantity: Number(formData.inventory.quantity),
    //   }),
    // );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/${productId}`,
        {
          method: "PUT", // update method
          body: form,
        },
      );
      const data = await res.json();
      toast(" Product updated succesfully", {
        icon: <CircleCheckBig className="text-green-500" />,
      });
      console.log("Updated product:", data);
      navigate("/products");
    } catch (err) {
      toast(" Failed to update", {
        icon: <CircleX className="text-red-500" />,
      });
      console.error("Error updating product:", err);
    }
  };

  return (
    <Back>
      <div className="flex w-full max-lg:flex-col gap-4 xl:px-46 py-4">
        <ChartBarHorizontal />
        <ChartRadialText />
      </div>
      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46"
      >
        <div className="lg:col-span-2 flex flex-col gap-2">
          <BasicInfoCard formData={formData} setFormData={setFormData} />
          <PricingCard formData={formData} setFormData={setFormData} />
          <SellingUnitsCard formData={formData} setFormData={setFormData} />
        </div>

        <div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
          <MediaCard formData={formData} setFormData={setFormData} />
          <InventoryCard formData={formData} setFormData={setFormData} />
          <VendorCard formData={formData} setFormData={setFormData} />
        </div>
      </form>

      <div className="w-full flex max-sm:justify-center justify-end sm:pr-24 items-center">
        <Button type="submit" className="mt-6 w-[220px]" onClick={handleSubmit}>
          Update Product
        </Button>
      </div>
    </Back>
  );
}
