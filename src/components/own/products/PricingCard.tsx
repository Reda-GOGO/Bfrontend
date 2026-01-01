import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductUnit } from "@/types";

export default function PricingCard({
  product,
  setProduct,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing &amp; Selling Units</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DefaultCard product={product} setProduct={setProduct} />
        <UnitVariant product={product} setProduct={setProduct} />
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function DefaultCard({
  product,
  setProduct,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}) {
  const profit = product.price - product.cost;
  const margin =
    product.price > 0 ? Math.round((profit / product.price) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-background p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge>Default</Badge>

          <div
            className={`text-sm font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            {profit.toFixed(2)} MAD ({margin}%)
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              placeholder="piece, kg, meter…"
              value={product.unit}
              onChange={(e) =>
                setProduct((p) => ({ ...p, unit: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Cost</Label>
            <Input
              type="number"
              step="0.01"
              value={product.cost}
              onChange={(e) =>
                setProduct((p) => ({ ...p, cost: Number(e.target.value) }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Selling price</Label>
            <Input
              type="number"
              step="0.01"
              value={product.price}
              onChange={(e) =>
                setProduct((p) => ({ ...p, price: Number(e.target.value) }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface UnitVariantProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

export function UnitVariant({ product, setProduct }: UnitVariantProps) {
  const defaultUnit = product.unit;
  const defaultPrice = product.price;
  const defaultCost = product.cost;

  // Load existing variants or start empty
  const initialVariants = product.units?.filter((u) => !u.isBase) || [];
  const [variantUnits, setVariantUnits] = useState<ProductUnit[]>(
    initialVariants.length ? initialVariants : [],
  );

  // Add new variant
  const addVariant = () => {
    setVariantUnits((prev) => [
      ...prev,
      {
        name: "",
        isBase: false,
        quantityInBase: 1,
        defaultValue: 1,
        variantValue: 1,
        price: parseFloat(defaultPrice.toFixed(2)),
        cost: parseFloat(defaultCost.toFixed(2)),
      } as ProductUnit,
    ]);
  };

  // Delete variant
  const deleteVariant = (index: number) => {
    setVariantUnits((prev) => prev.filter((_, i) => i !== index));
  };

  // Update input values and recalc quantityInBase, price, cost
  const onValueChange = (
    index: number,
    field: "defaultValue" | "variantValue",
    value: number,
  ) => {
    const updated = [...variantUnits];
    updated[index][field] = value;

    const def = updated[index].defaultValue || 1;
    const varv = updated[index].variantValue || 1;

    // quantityInBase = variant / default
    updated[index].quantityInBase = varv / def;

    // Auto calculate price & cost for variant
    updated[index].price = parseFloat(
      (defaultPrice * updated[index].quantityInBase).toFixed(2),
    );
    updated[index].cost = parseFloat(
      (defaultCost * updated[index].quantityInBase).toFixed(2),
    );

    setVariantUnits(updated);
  };

  // Sync all units to product.units including default unit
  useEffect(() => {
    const baseUnit: ProductUnit = {
      name: defaultUnit,
      quantityInBase: 1,
      isBase: true,
      defaultValue: 1,
      variantValue: 1,
      price: defaultPrice,
      cost: defaultCost,
    };

    const validVariants = variantUnits.filter((v) => v.name.trim() !== "");
    setProduct((prev) => ({ ...prev, units: [baseUnit, ...validVariants] }));
  }, [variantUnits, defaultUnit, defaultPrice, defaultCost, setProduct]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button
        size="sm"
        className="w-full"
        type="button"
        onClick={addVariant}
        disabled={!defaultUnit}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Variant
      </Button>

      {variantUnits.map((v, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 border rounded-lg p-4 relative"
        >
          {/* Delete button */}
          <div className="flex w-full justify-between">
            <span className="text-muted-foreground text-xs">
              unit variant(s)
            </span>
            <Button
              variant="destructive"
              size="sm"
              className=" top-2 right-2"
              onClick={() => deleteVariant(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {/* Variant Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="meter, box, kg…"
              value={v.name}
              onChange={(e) => {
                const updated = [...variantUnits];
                updated[index].name = e.target.value;
                setVariantUnits(updated);
              }}
            />
          </div>

          {/* Conversion Inputs */}
          {v.name.trim() !== "" && (
            <div className="space-y-2">
              <Label>Conversion</Label>
              <div className="flex items-center gap-2 w-full">
                {/* Default unit input */}
                <Input
                  type="number"
                  className=" text-center"
                  value={v.defaultValue}
                  onChange={(e) =>
                    onValueChange(
                      index,
                      "defaultValue",
                      parseFloat(e.target.value),
                    )
                  }
                />
                <span>{defaultUnit}</span>

                <ArrowLeftRight className="w-12 h-12" />

                {/* Variant input */}
                <Input
                  type="number"
                  className=" text-center"
                  value={v.variantValue}
                  onChange={(e) =>
                    onValueChange(
                      index,
                      "variantValue",
                      parseFloat(e.target.value),
                    )
                  }
                />
                <span>{v.name}</span>
              </div>

              {/* Price & Cost Inputs */}
              <div className="flex gap-2 mt-2">
                <div className="w-full flex flex-col">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const updated = [...variantUnits];
                      updated[index].price = parseFloat(e.target.value);
                      setVariantUnits(updated);
                    }}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Label>Cost</Label>
                  <Input
                    type="number"
                    value={v.cost}
                    onChange={(e) => {
                      const updated = [...variantUnits];
                      updated[index].cost = parseFloat(e.target.value);
                      setVariantUnits(updated);
                    }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                1 {defaultUnit} = {v.quantityInBase} {v.name}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
