import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types";

export default function BasicInfoCard({
  product,
  setProduct,
}: { product: Product; setProduct: (product: Product) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            value={product.name}
            onChange={(e) =>
              setProduct((prev: Product) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Handle</Label>
          <Input
            value={product.handle}
            disabled
            onChange={(e) =>
              setProduct((prev: Product) => ({
                ...prev,
                handle: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={product.description}
            disabled
            onChange={(e) =>
              setProduct((prev: Product) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
