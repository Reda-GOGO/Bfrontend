import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMAD } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderPayment({ order }: { order: Order }) {
  return (
    <div className="w-full col-span-2  ">
      <Card>
        <CardHeader>
          <CardTitle> Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-col">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal ({order.items.length} items)</span>
            <span>MAD {formatMAD(order.totalAmount)}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="discount" className="text-sm font-medium">
              Discount (MAD)
            </Label>
            <Input
              id="discount"
              type="number"
              min={0}
              value={order.discount}
              disabled
              placeholder="Enter discount amount"
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax (20%)</span>
            <span>MAD {formatMAD(order.totalAmount * order.tax)}</span>
          </div>

          <div className="border-t pt-4 flex justify-between items-center font-medium text-base">
            <span>Total</span>
            <span className="text-primary font-semibold">
              MAD {formatMAD(order.totalAmountWithTax)}
            </span>
          </div>

          <div className="flex flex-col space-y-1 pt-4">
            <Label className="text-sm font-medium">
              Total Amount in French Words
            </Label>
            <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground leading-relaxed">
              {order.totalAmountString}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
