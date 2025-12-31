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
import { useParams } from "react-router";

export default function Update() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
    inventory: { unit: "", quantity: "" },
    vendor: { name: "", contact: "" },
    image: null as File | null,
    imagePreview: "",
  });

  // 🔹 Fetch product
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/${id}`,
        );
        const data: Product = await res.json();

        setProduct(data);

        // 🔹 Prefill form
        setFormData({
          title: data.name,
          handle: data.handle,
          description: data.description ?? "",
          price: data.price,
          cost: data.cost,
          profit: data.price - data.cost,
          margin:
            data.price > 0 ? ((data.price - data.cost) / data.price) * 100 : 0,

          baseUnit: {
            name: data.unit,
            price: String(
              data.units.find((u) => u.name === data.unit)?.price ?? "",
            ),
          },

          units: data.units.map((u) => ({
            name: u.name,
            price: String(u.price),
            conversion: String(u.quantityInBase),
          })),

          inventory: {
            unit: data.unit,
            quantity: String(data.availableQty ?? 0),
          },

          vendor: {
            name: data.vendorName ?? "",
            contact: data.vendorContact ?? "",
          },

          image: null,
          imagePreview: data.image ?? "",
        });
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const form = new FormData();

    if (formData.image) {
      form.append("image", formData.image);
    }

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

    form.append(
      "inventory",
      JSON.stringify({
        unit: formData.inventory.unit,
        quantity: Number(formData.inventory.quantity),
      }),
    );

    await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  if (loading) return <p>Loading…</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <Back>
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

      <div className="w-full flex max-sm:justify-center justify-end sm:pr-24">
        <Button type="submit" className="mt-6 w-[220px]">
          Update Product
        </Button>
      </div>
    </Back>
  );
}
