import { useOrderContext } from "@/contexts/orderContext";
import { Input } from "@/components/ui/input";
import { ImageOff, Minus, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function OrderLine({ product }) {
  const { setOrderItems, setSelectedProducts } = useOrderContext();

  const allUnits = useMemo(
    () =>
      product.units.map((u) => ({
        name: u.name,
        price: u.price,
        quantityInBase: u.quantityInBase,
        id: u.id,
      })),
    [product.units],
  );

  const [selectedUnit, setSelectedUnit] = useState(allUnits[0]);
  const [editedUnitName, setEditedUnitName] = useState(allUnits[0].name);
  const [editingUnitName, setEditingUnitName] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  // Update line total & profit
  const lineTotal = useMemo(
    () => parseFloat((selectedPrice * currentQuantity).toFixed(2)),
    [selectedPrice, currentQuantity],
  );

  const lineProfit = useMemo(
    () =>
      parseFloat(((selectedPrice - product.cost) * currentQuantity).toFixed(2)),
    [selectedPrice, currentQuantity, product.cost],
  );

  // Sync orderItems whenever price or quantity changes
  useEffect(() => {
    setOrderItems((prev) =>
      prev.map((p) =>
        p.productId === product.id
          ? {
            ...p,
            unit: selectedUnit.name,
            productUnit: selectedUnit.id ?? null,
            price: selectedPrice,
            quantity: currentQuantity,
            totalAmount: lineTotal,
            unitProfit: selectedPrice - product.cost,
            totalProfit: lineProfit,
          }
          : p,
      ),
    );
  }, [selectedPrice, currentQuantity, selectedUnit, lineTotal, lineProfit]);

  // Reset when product changes
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

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value) || 0;
    setCurrentQuantity(quantity);
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setSelectedPrice(newPrice);
  };

  const handleUnitRename = () => {
    setSelectedUnit((prev) => ({ ...prev, name: editedUnitName }));
  };

  const deleteItem = () => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
    setOrderItems((prev) => prev.filter((p) => p.productId !== product.id));
  };

  const incrementQuantity = () => setCurrentQuantity(currentQuantity + 1);
  const decrementQuantity = () =>
    setCurrentQuantity(currentQuantity > 1 ? currentQuantity - 1 : 1);

  return (
    <div className="w-full border rounded-xl p-4 shadow-sm bg-background mb-4">
      {/* Top section: Image & Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {product.image ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${product.image}`}
              alt={product.name}
              className="h-16 w-16 object-cover rounded-md"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-md">
              <ImageOff className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{product.name}</span>
            <span className="text-xs text-muted-foreground">
              Unit price: {selectedPrice} MAD
            </span>
          </div>
          <div className="flex">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteItem}
              className="w-full sm:w-auto flex justify-center"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Unit & Rename */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <Label className="text-xs mb-1 block">Select Unit</Label>
          <Select value={selectedUnit.name} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-full">
              <SelectValue>{selectedUnit.name}</SelectValue>
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectLabel>Units</SelectLabel>
                {allUnits.map((unit, index) => (
                  <SelectItem key={unit.name + index} value={unit.name}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs">Rename Unit</Label>
            <Switch
              checked={editingUnitName}
              onCheckedChange={setEditingUnitName}
            />
          </div>
          <Input
            type="text"
            disabled={!editingUnitName}
            value={editedUnitName}
            onChange={(e) => setEditedUnitName(e.target.value)}
            onBlur={handleUnitRename}
            placeholder="Custom unit name"
          />
        </div>
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs">Edit Price</Label>
            <Switch checked={editingPrice} onCheckedChange={setEditingPrice} />
          </div>
          <Input
            type="number"
            min={0}
            value={selectedPrice}
            onChange={handlePriceChange}
            disabled={!editingPrice}
          />
        </div>

        <div>
          <Label className="text-xs mb-1 block">Quantity</Label>
          <div className="flex gap-1 items-center">
            <Button size="sm" onClick={decrementQuantity}>
              <Minus />
            </Button>
            <Input
              type="number"
              value={currentQuantity}
              onChange={handleQuantityChange}
              className="text-center"
            />
            <Button size="sm" onClick={incrementQuantity}>
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      {/* Line Total & Profit */}
      <div className="mt-2 p-2 bg-muted rounded-md text-sm flex justify-between">
        <span>Line Total:</span>
        <span>{lineTotal} MAD</span>
      </div>
      <div className="mt-1 p-2 bg-muted rounded-md text-sm flex justify-between">
        <span>Profit:</span>
        <span>{lineProfit} MAD</span>
      </div>
    </div>
  );
}
