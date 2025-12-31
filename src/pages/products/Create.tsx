import Back from "@/components/own/Back";
import BasicInfoCard from "@/components/own/products/BasicInfoCard";
import InventoryCard from "@/components/own/products/InventoryCard";
import MediaCard from "@/components/own/products/MediaCard";
import PricingCard from "@/components/own/products/PricingCard";
import SellingUnitsCard from "@/components/own/products/SellingUnitsCard";
import VendorCard from "@/components/own/products/VendorCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

function CreateProductAlert() {
  return (
    <div className="flex flex-row gap-2">
      <Button variant="secondary" className="max-sm:w-24 w-full capitalize">
        discard
      </Button>
      <Button className="max-sm:w-24 w-full capitalize">save</Button>
    </div>
  );
}

export default function Create() {
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
    inventory: { unit: "", quantity: "" },
    vendor: { name: "", contact: "" },
    image: null as File | null,
    imagePreview: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    // append file (multer will pick this up as req.file)
    if (formData.image) {
      form.append("image", formData.image);
    }

    // append product fields
    form.append("name", formData.title);
    form.append("handle", formData.handle);
    form.append("description", formData.description);
    form.append("cost", String(formData.cost));
    form.append("price", String(formData.price));
    form.append("unit", formData.baseUnit.name);
    form.append("vendorName", formData.vendor.name);
    form.append("vendorContact", formData.vendor.contact);

    // append units (array → JSON string)
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

    // append inventory
    form.append(
      "inventory",
      JSON.stringify({
        unit: formData.inventory.unit,
        quantity: Number(formData.inventory.quantity),
      }),
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      navigate("/products");
      console.log("Saved product:", data);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <>
      <Back>
        <form
          onSubmit={(e) => handleSubmit(e)}
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
          <Button
            type="submit"
            className="mt-6 w-[220px]"
            onClick={(e) => handleSubmit(e)}
          >
            Save Product
          </Button>
        </div>
      </Back>
    </>
  );
}
