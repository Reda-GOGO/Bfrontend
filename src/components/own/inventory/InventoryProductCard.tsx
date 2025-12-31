import { ProductImage } from "@/components/shared/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatMAD } from "@/lib/utils";
import type { Product } from "@/types";
import { Layers3 } from "lucide-react";

export function InventoryProductCard({ product }: { product: Product }) {
  const defaultUnit =
    product.units.find((u) => u.name === product.unit) ?? product.units[0];

  const [isEditing, setIsEditing] = useState(false);
  const [confirmedBaseQty, setConfirmedBaseQty] = useState<number | null>(null);

  // Existing stock
  const existingBaseQty = product.availableQty ?? 0;

  // Total quantity in default unit
  const totalBaseQty = confirmedBaseQty ?? existingBaseQty;

  return (
    <div className="flex flex-col lg:flex-row bg-card rounded-xl border py-3 gap-3">
      <ProductCard product={product} />

      <Separator orientation="vertical" className="hidden lg:block" />
      <Separator orientation="horizontal" className="block lg:hidden" />

      <div className="flex flex-col w-full gap-2">
        {/* Always show quantity preview */}
        {/* <ProductQuantity.PreviewOnly */}
        {/*   existingBaseQty={existingBaseQty} */}
        {/*   addedBaseQty={isEditing ? 0 : 0} // no added yet */}
        {/*   totalBaseQty={totalBaseQty} */}
        {/*   defaultUnit={defaultUnit} */}
        {/* /> */}

        {/* Render form only when editing */}
        {isEditing && (
          <ProductQuantity
            product={product}
            onConfirm={(totalBaseQty) => {
              setConfirmedBaseQty(totalBaseQty);
              setIsEditing(false);
            }}
          />
        )}

        {!isEditing && (
          <Button className="mt-2 w-full" onClick={() => setIsEditing(true)}>
            Edit quantity
          </Button>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex p-2 gap-4 min-w-fit">
      <ProductImage src={product.image} className="w-24 h-24 sm:w-30 sm:h-30" />
      <div className="flex flex-col gap-1">
        <span className="text-lg sm:text-xl font-bold">{product.name}</span>
        <span className="text-md sm:text-xl text-muted-foreground font-semibold">
          {formatMAD(product.price)} MAD
        </span>
        <div className="flex text-sm text-muted-foreground gap-1 items-center">
          <Layers3 className="w-4 h-4" />
          <span>{product.units?.length ?? 0} unit variant(s)</span>
        </div>
        <Badge className="w-fit">{product.unit}</Badge>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import type { Product, Unit } from "@/types";

export function ProductQuantity({
  product,
  onConfirm,
}: {
  product: Product;
  onConfirm: (totalBaseQty: number) => void;
}) {
  const defaultUnit =
    product.units.find((u) => u.name === product.unit) ?? product.units[0];

  const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
  const [baseQty, setBaseQty] = useState(defaultUnit.quantityInBase);

  // Existing stock (in base units)
  const existingBaseQty = product.availableQty ?? 0;

  const displayQty = baseQty / selectedUnit.quantityInBase;
  const totalBaseQty = existingBaseQty + baseQty;

  const conversionToDefault =
    selectedUnit.quantityInBase / defaultUnit.quantityInBase;

  const increment = () =>
    setBaseQty((prev) => prev + selectedUnit.quantityInBase);

  const decrement = () =>
    setBaseQty((prev) =>
      Math.max(selectedUnit.quantityInBase, prev - selectedUnit.quantityInBase),
    );

  return (
    <div className="flex flex-col gap-4 px-3 w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <QuantityForm
          product={product}
          selectedUnit={selectedUnit}
          defaultUnit={defaultUnit}
          displayQty={displayQty}
          conversionToDefault={conversionToDefault}
          onUnitChange={(unit) => {
            setSelectedUnit(unit);
            setBaseQty(unit.quantityInBase);
          }}
          onIncrement={increment}
          onDecrement={decrement}
        />

        <QuantityPreview
          existingQty={existingBaseQty / selectedUnit.quantityInBase}
          addedQty={displayQty}
          totalQty={totalBaseQty / selectedUnit.quantityInBase}
          unitName={selectedUnit.name}
        />
      </div>

      <Button className="w-full" onClick={() => onConfirm(totalBaseQty)}>
        Confirm quantity change
      </Button>
    </div>
  );
}

// PreviewOnly component for showing quantity row without form
ProductQuantity.PreviewOnly = function ({
  existingBaseQty,
  addedBaseQty,
  totalBaseQty,
  defaultUnit,
}: {
  existingBaseQty: number;
  addedBaseQty: number;
  totalBaseQty: number;
  defaultUnit: Unit;
}) {
  return (
    <QuantityPreview
      existingQty={existingBaseQty / defaultUnit.quantityInBase}
      addedQty={addedBaseQty / defaultUnit.quantityInBase}
      totalQty={totalBaseQty / defaultUnit.quantityInBase}
      unitName={defaultUnit.name}
    />
  );
};

function QuantityForm({
  product,
  selectedUnit,
  defaultUnit,
  displayQty,
  conversionToDefault,
  onUnitChange,
  onIncrement,
  onDecrement,
}: {
  product: Product;
  selectedUnit: Unit;
  defaultUnit: Unit;
  displayQty: number;
  conversionToDefault: number;
  onUnitChange: (unit: Unit) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full lg:min-w-[260px]">
      <span className="text-sm text-muted-foreground">
        Adjust product quantity
      </span>

      <Select
        value={selectedUnit.name}
        onValueChange={(value) => {
          const unit = product.units.find((u) => u.name === value);
          if (unit) onUnitChange(unit);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {product.units.map((unit) => (
            <SelectItem key={unit.id} value={unit.name}>
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={onDecrement}>
          <Minus size={16} />
        </Button>

        <Input value={displayQty} readOnly className="text-center" />

        <Button size="icon" variant="outline" onClick={onIncrement}>
          <Plus size={16} />
        </Button>
      </div>

      {selectedUnit.name !== defaultUnit.name && (
        <p className="text-xs text-muted-foreground text-center">
          1 {selectedUnit.name} = {conversionToDefault.toFixed(3)}{" "}
          {defaultUnit.name}
        </p>
      )}

      <div className="text-center space-y-1">
        <p className="text-sm font-medium">
          {selectedUnit.price} MAD / {selectedUnit.name}
        </p>

        {selectedUnit.name !== defaultUnit.name && (
          <p className="text-xs text-muted-foreground">
            ≈ {(selectedUnit.price / conversionToDefault).toFixed(2)} MAD /{" "}
            {defaultUnit.name}
          </p>
        )}
      </div>
    </div>
  );
}

function QuantityPreview({
  existingQty,
  addedQty,
  totalQty,
  unitName,
}: {
  existingQty: number;
  addedQty: number;
  totalQty: number;
  unitName: string;
}) {
  return (
    <Card className="flex flex-wrap flex-row sm:flex-nowrap justify-center items-center gap-4 px-4 py-3 text-sm w-full">
      <PreviewBlock label="In stock" value={existingQty} unit={unitName} />
      <span className="text-muted-foreground">+</span>
      <PreviewBlock label="Adding" value={addedQty} unit={unitName} />
      <span className="text-muted-foreground">=</span>
      <PreviewBlock label="Total" value={totalQty} unit={unitName} highlight />
    </Card>
  );
}

function PreviewBlock({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-muted-foreground">{label}</p>
      <p className={highlight ? "font-semibold" : "font-medium"}>
        {value.toFixed(2)} {unit}
      </p>
    </div>
  );
}
