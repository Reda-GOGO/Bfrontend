import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Trash2 } from "lucide-react";

export default function SellingUnitsCard({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const baseUnit = formData.baseUnit;
  const units = formData.units;

  const handleAddUnit = (e: Event) => {
    e.preventDefault();
    setFormData((prev: any) => ({
      ...prev,
      units: [...prev.units, { name: "", price: "", conversion: "" }],
    }));
  };

  const handleChangeUnit = (
    index: number,
    field: "name" | "price" | "conversion",
    value: string,
  ) => {
    const newUnits = [...units];
    newUnits[index][field] = value;
    setFormData((prev: any) => ({ ...prev, units: newUnits }));
  };

  const handleRemoveUnit = (index: number) => {
    const newUnits = [...units];
    newUnits.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, units: newUnits }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selling Units</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Base Unit */}
        <div className="space-y-2 border p-4 rounded-md">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Base Unit
          </h4>
          <div className="flex flex-row w-full gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Packet"
                value={baseUnit.name}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    baseUnit: { ...prev.baseUnit, name: e.target.value },
                  }))
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="e.g. 300"
                disabled
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    baseUnit: { ...prev.baseUnit, price: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Additional Units */}
        <div className="space-y-4">
          {units.map((unit: any, index: number) => (
            <div
              key={index}
              className="border p-4 rounded-md space-y-2 relative"
            >
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveUnit(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <h4 className="font-semibold text-sm text-muted-foreground">
                Additional Unit #{index + 1}
              </h4>
              <div className="flex flex-row gap-4">
                <div className="flex w-full flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g. Sachet"
                    value={unit.name}
                    onChange={(e) =>
                      handleChangeUnit(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 25"
                    value={unit.price}
                    onChange={(e) =>
                      handleChangeUnit(index, "price", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Conversion (How many of <strong>{unit.name || "..."}</strong>{" "}
                  in 1 {baseUnit.name || "base unit"})
                </Label>
                <div className="flex flex-row gap-2">
                  <Input type="text" value={`1 ${baseUnit.name}`} disabled />
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={unit.conversion}
                    onChange={(e) =>
                      handleChangeUnit(index, "conversion", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={(e) => handleAddUnit(e)}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Additional Unit
        </Button>
      </CardContent>
    </Card>
  );
}
