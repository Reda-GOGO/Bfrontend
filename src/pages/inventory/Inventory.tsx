import { InventoryFilters } from "@/components/own/inventory/InventoryFilters";
import { InventoryProductCard } from "@/components/own/inventory/InventoryProductCard";
import { InventoryStats } from "@/components/own/inventory/InventoryStats";
import { ProductImage } from "@/components/shared/ProductImage";
import { TitleLayout } from "@/components/shared/title-layout";
import { Badge } from "@/components/ui/badge";
import { formatMAD } from "@/lib/utils";
import type { Product } from "@/types";
import { Layers, Layers3 } from "lucide-react";

export default function Inventory() {
  return (
    <div className="w-full flex flex-col gap-2">
      <InventoryHeader />
      <InventoryContent />
    </div>
  );
}

function InventoryHeader() {
  return (
    <div className="flex w-full py-1 gap-4 flex-col">
      <TitleLayout title="Inventory" icon={<Layers />} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inventory &amp; Stock
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor stock levels across warehouses and set up low-stock alerts.
        </p>
      </div>
      <InventoryStats />
    </div>
  );
}

function InventoryContent() {
  return (
    <div className="flex w-full flex-col gap-3">
      <InventoryFilters />
      <InventoryGrid />
    </div>
  );
}

function InventoryGrid() {
  return (
    <div className="flex flex-col w-full gap-4">
      {new Array(10).fill(null).map((_, index) => (
        <InventoryProductCard product={PRODUCT} key={index + 32} />
      ))}
    </div>
  );
}

const PRODUCT = {
  id: 5,
  name: "Bande a joint 150m ",
  handle: "11291497944252e6",
  image: "/uploads/1758498455862-81372853.webp",
  description: "Description for product 12",
  cost: 80,
  price: 379,
  unit: "metre",
  vendorName: "Vendor C",
  vendorContact: "0634567890",
  createdAt: "2025-12-04T20:26:14.386Z",
  updatedAt: null,
  availableQty: -3,
  archived: false,
  units: [
    {
      id: 5,
      productId: 5,
      name: "packet",
      quantityInBase: 10,
      isBase: true,
      price: 3790,
      cost: 800,
      createdAt: "2025-12-04T20:26:19.988Z",
      updatedAt: null,
      archived: false,
    },
    {
      id: 6,
      productId: 5,
      name: "metre",
      quantityInBase: 1,
      isBase: true,
      price: 379,
      cost: 80,
      createdAt: "2025-12-04T20:26:19.988Z",
      updatedAt: null,
      archived: false,
    },
  ],
};
