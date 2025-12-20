import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryCard({ formData, setFormData }: any) {
  // Build options safely
  const options = [
    formData.baseUnit?.name,
    ...(formData.units || []).map((u: any) => u?.name),
    formData.inventoryUnit, // explicitly include current inventoryUnit
  ].filter((v) => typeof v === "string" && v.trim() !== ""); // ✅ only keep non-empty strings

  // Ensure unique values
  const uniqueOptions = Array.from(new Set(options));

  console.log("InventoryUnit value:", formData.inventoryUnit);
  console.log("Options:", uniqueOptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Select Unit for Inventory</Label>
          {uniqueOptions.length > 0 && (
            <Select
              value={formData.inventoryUnit ?? undefined}
              onValueChange={(val) =>
                setFormData((prev: any) => ({
                  ...prev,
                  inventoryUnit: val,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {uniqueOptions.map((opt, idx) => (
                  <SelectItem key={idx} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={formData.inventoryQuantity}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                inventoryQuantity: e.target.value,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
