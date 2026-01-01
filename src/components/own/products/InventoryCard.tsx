import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Props = {
  product: {
    availableQty: number;
    unit: string;
  };
  setProduct: React.Dispatch<
    React.SetStateAction<{
      availableQty: number;
      unit: string;
    }>
  >;
};

export default function InventoryCard({ product, setProduct }: Props) {
  const [trackStock, setTrackStock] = React.useState(true);
  const [lowStockAt, setLowStockAt] = React.useState<number>(0);

  const isOutOfStock = trackStock && product.availableQty <= lowStockAt;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory</CardTitle>

        {isOutOfStock && <Badge variant="destructive">Out of stock</Badge>}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ================= TRACKING ================= */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Checkbox
            checked={trackStock}
            onCheckedChange={(v) => setTrackStock(Boolean(v))}
          />

          <div className="space-y-1">
            <Label>Track inventory</Label>
            <p className="text-xs text-muted-foreground">
              Stock level will be monitored automatically
            </p>
          </div>
        </div>

        {/* ================= QUANTITY ================= */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Available quantity{" "}
              <span className="text-muted-foreground">
                {product.unit ? `(${product.unit})` : ""}
              </span>
            </Label>

            <Input
              type="number"
              min={0}
              disabled={!trackStock}
              value={product.availableQty}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  availableQty: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* ================= LOW STOCK ================= */}
          <div className="space-y-2">
            <Label>Low stock threshold</Label>
            <Input
              type="number"
              min={0}
              disabled={!trackStock}
              value={lowStockAt}
              onChange={(e) => setLowStockAt(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
