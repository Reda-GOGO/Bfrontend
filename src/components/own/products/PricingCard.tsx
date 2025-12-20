import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function PricingCard({ formData, setFormData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row w-full gap-2 py-4">
          <div className="flex w-full flex-col gap-2">
            <Label>Price</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label>Cost</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, cost: e.target.value }))
              }
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-row w-full gap-2 py-4">
          <div className="flex w-full flex-col gap-2">
            <Label>Profit</Label>
            <Input
              type="number"
              value={formData.price - formData.cost}
              disabled
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  profit: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label>Margin</Label>
            <Input
              type="number"
              value={parseFloat(
                ((formData.price - formData.cost) / formData.price) * 100,
              ).toFixed(2)}
              disabled
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  margin: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
