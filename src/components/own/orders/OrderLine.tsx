import { useOrderContext } from "@/contexts/orderContext";
import { Input } from "@/components/ui/input";
import { Check, ImageOff, Minus, Pencil, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function OrderLine({ product }) {
  const { setOrderItems, setSelectedProducts } = useOrderContext();

  const allUnits = useMemo(
    () =>
      product.units.map((u) => ({
        name: u.name,
        price: u.price,
        cost: u.cost,
        quantityInBase: u.quantityInBase,
        id: u.id,
      })),
    [product.units],
  );

  const [selectedUnit, setSelectedUnit] = useState(allUnits[0]);
  const [editedUnitName, setEditedUnitName] = useState(allUnits[0].name);
  const [isEditingUnitName, setIsEditingUnitName] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const lineTotal = useMemo(
    () => parseFloat((selectedPrice * currentQuantity).toFixed(2)),
    [selectedPrice, currentQuantity],
  );

  const lineProfit = useMemo(
    () =>
      parseFloat(
        ((selectedPrice - selectedUnit.cost) * currentQuantity).toFixed(2),
      ),
    [selectedPrice, currentQuantity, selectedUnit],
  );

  useEffect(() => {
    setOrderItems((prev) =>
      prev.map((p) =>
        p.productId === product.id
          ? {
            ...p,
            unit: selectedUnit.name,
            productUnit: selectedUnit.id ?? null,
            unitPrice: selectedPrice,
            quantity: currentQuantity,
            totalAmount: lineTotal,
            unitProfit: selectedPrice - selectedUnit.cost,
            totalProfit: lineProfit,
          }
          : p,
      ),
    );
  }, [selectedPrice, currentQuantity, selectedUnit, lineTotal, lineProfit]);

  useEffect(() => {
    setSelectedUnit(allUnits[0]);
    setEditedUnitName(allUnits[0].name);
    setSelectedPrice(allUnits[0].price);
    setCurrentQuantity(1);
  }, [product.id]);

  const handleUnitChange = (unitName: string) => {
    const unit = allUnits.find((u) => u.name === unitName);
    if (!unit) return;
    setSelectedUnit(unit);
    setEditedUnitName(unit.name);
    setSelectedPrice(unit.price);
  };

  const deleteItem = () => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    setOrderItems((prev) => prev.filter((p) => p.productId !== product.id));
  };

  const incrementQuantity = () => setCurrentQuantity(currentQuantity + 1);
  const decrementQuantity = () =>
    setCurrentQuantity(currentQuantity > 1 ? currentQuantity - 1 : 1);

  const confirmUnitRename = () => {
    setSelectedUnit((prev) => ({ ...prev, name: editedUnitName }));
    setIsEditingUnitName(false);
  };

  const confirmPriceEdit = () => setIsEditingPrice(false);

  return (
    <div className="group w-full rounded-xl border bg-card/70 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
      {/* HEADER */}
      <div className="flex items-start gap-4 mb-4">
        {product.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${product.image}`}
            alt={product.name}
            className="h-16 w-16 rounded-md object-cover border"
          />
        ) : (
          <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md border">
            <ImageOff className="text-muted-foreground h-6 w-6" />
          </div>
        )}

        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedUnit.name} • {selectedPrice} MAD
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={deleteItem}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* UNIT & PRICE SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        {/* UNIT SELECT + INLINE RENAME */}
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <Select value={selectedUnit.name} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-full sm:w-40 rounded-lg text-sm">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allUnits.map((unit, i) => (
                  <SelectItem key={unit.name + i} value={unit.name}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {isEditingUnitName ? (
            <div className="flex items-center gap-1">
              <Input
                className="w-28 h-8 text-sm"
                value={editedUnitName}
                onChange={(e) => setEditedUnitName(e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={confirmUnitRename}
                className="h-8 w-8 text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingUnitName(true)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title="Rename Unit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* PRICE EDIT */}
        <div className="flex items-center gap-2 w-full sm:w-1/2 justify-end">
          {isEditingPrice ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                className="w-28 h-8 text-sm"
                value={selectedPrice}
                onChange={(e) =>
                  setSelectedPrice(parseFloat(e.target.value) || 0)
                }
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={confirmPriceEdit}
                className="h-8 w-8 text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditingPrice(true)}
            >
              <span>{selectedPrice.toFixed(2)} MAD</span>
              <Pencil className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex gap-2 items-center justify-start mb-4">
        <Button
          size="icon"
          variant="outline"
          onClick={decrementQuantity}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={currentQuantity}
          onChange={(e) => setCurrentQuantity(parseFloat(e.target.value) || 0)}
          className="text-center w-16 h-8"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={incrementQuantity}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* TOTALS */}
      <div className="mt-3 border-t pt-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {currentQuantity} × {selectedPrice.toFixed(2)} MAD
          </span>
          <span className="font-semibold text-foreground">
            {lineTotal.toFixed(2)} MAD
          </span>
        </div>

        <div
          className={cn(
            "flex justify-between text-xs mt-1 rounded-md px-2 py-1",
            lineProfit < 0
              ? "bg-destructive/10 text-destructive"
              : "bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-400",
          )}
        >
          <span>Profit</span>
          <span>
            {lineProfit > 0 ? "+" : ""}
            {lineProfit.toFixed(2)} MAD
          </span>
        </div>
      </div>
    </div>
  );
}
