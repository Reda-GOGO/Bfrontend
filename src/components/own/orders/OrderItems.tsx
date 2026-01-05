import { ProductImage } from "@/components/shared/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatMAD } from "@/lib/utils";
import type { Order, OrderItem } from "@/types";
import { Minus, Plus } from "lucide-react";

export default function OrderItems({ order }: { order: Order }) {
  console.log("order : ", order);
  return (
    <div className="w-full col-span-2  ">
      <Card>
        <CardHeader>
          <CardTitle>Order Product(s)</CardTitle>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col ">
          {order.items?.map((item, index) => (
            <ItemCard item={item} key={index + 1} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ItemCard({ item }: { item: OrderItem }) {
  return (
    <div className="flex w-full flex-col p-4 border rounded-lg ">
      <div className="flex w-full max-md:flex-col">
        <ProductInfo item={item} />
      </div>
      <Separator orientation="horizontal" />
      <div className="flex w-full items-center justify-between px-2 py-1">
        <span className="text-sm text-muted-foreground">
          {" "}
          {item.quantity} × {formatMAD(item.unitPrice)} MAD{" "}
        </span>
        <span className="text-sm font-semibold">
          {formatMAD(item.totalAmount)} MAD
        </span>
      </div>
    </div>
  );
}

function ProductInfo({ item }: { item: OrderItem }) {
  return (
    <div className="flex w-full md:gap-12 gap-4 ">
      <ProductImage src={item.product?.image} className="w-20 h-20" />
      <div className="flex flex-col gap-1 w-full">
        <span className="text-lg font-bold "> {item.product.name} </span>
        <span className="text-sm text-muted-foreground font-semibold ">
          {" "}
          {formatMAD(item.unitPrice)} MAD
        </span>

        <ProductQuantity item={item} />
      </div>
    </div>
  );
}

function ProductQuantity({ item }: { item: OrderItem }) {
  return (
    <div className="flex gap-2 items-center justify-start mb-4">
      <Button size="icon" variant="outline" className="h-8 w-8" disabled>
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={item.quantity}
        disabled
        className="text-center w-16 h-8"
      />
      <Button size="icon" variant="outline" className="h-8 w-8" disabled>
        <Plus className="h-4 w-4" />
      </Button>

      <span className="text-sm text-muted-foreground"> {item.unit}</span>
    </div>
  );
}
