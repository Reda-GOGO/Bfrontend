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
      {/* {new Array(10).fill(null).map((_, index) => ( */}
      {/*   <InventoryProductCard product={PRODUCT} key={index + 32} /> */}
      {/* ))} */}
      <EmptyInventory />
    </div>
  );
}

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export function EmptyInventory() {
  return (
    <div className="flex w-full h-[450px] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Layers3 />
          </EmptyMedia>
          <EmptyTitle>No Product Added Yet in your Stock</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any product yet, Start adding products to
            your WarFare .
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" type="button">
              Add Product
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

