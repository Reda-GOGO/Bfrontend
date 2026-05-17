import { ProductImage } from "@/components/shared/ProductImage";
import Row from "@/components/shared/Row";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, formatMAD } from "@/lib/utils";
import type { Order, OrderItem } from "@/types";
import { CheckCircle2, Minus, Pencil, Plus, Trash2 } from "lucide-react";

export default function OrderItems({ order }: { order: Order }) {
  console.log("order : ", order);
  return (
    <div className="w-full col-span-2  ">
      <Card>
        <CardHeader>
          <CardTitle>Order Product(s)</CardTitle>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col h-[550px] ">
          <ScrollArea className="h-full w-full pr-4">
            <div className="flex flex-col gap-2 pb-4">
              {order.items?.map((item, index) => (
                <OrderLine item={item} key={index + 1} />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderLine({
  item,
  editOrderLine,
  removeOrderLine

}: {
  item: OrderItem;
}) {
  return (
    <div className="group flex items-center gap-3.5 rounded-xl border border-border/50 bg-card px-4 py-3.5 transition-colors hover:border-border">

      {/* Product image */}
      <PictureArea
        product={item.product}
        selected={true}
        className="h-[60px] w-[60px] min-w-[60px] rounded-lg border border-border/30 bg-muted object-cover"
      />

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">

        {/* Product name */}
        <span className="truncate text-sm font-medium text-foreground">
          {item.product.name}
        </span>

        {/* Unit / Price / Quantity — 3-column grid */}
        <div className="grid grid-cols-3 divide-x divide-border/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Unit
            </span>

            <div className="flex text-[13px] items-center gap-1.5">
              {item.unit !== item.productUnit.name ? (
                <>
                  <del className="text-muted-foreground">{item.productUnit.name}</del>
                  <span>{item.unit}</span>
                </>
              ) : (
                <span>{item.unit}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-0.5 pl-3">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Unit price
            </span>

            <Row className="gap-1 items-center">
              {item.unitPrice !== item.productUnit.price && (
                <span className="text-[10px] text-foreground">
                  <del>{formatMAD(item.productUnit.price)} MAD</del>
                </span>
              )}
              <span className="text-[13px] text-foreground">
                {formatMAD(item.unitPrice)} MAD
              </span>

            </Row>
          </div>
          <div className="flex flex-col gap-0.5 pl-3">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Quantity
            </span>
            <span className="text-[13px] text-foreground">
              {item.quantity} {item.unit}
            </span>
          </div>
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between border-t border-border/50 pt-2">
          <span className="text-[11px] text-muted-foreground">
            {item.quantity} {item.unit} × {formatMAD(item.unitPrice)} MAD
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Total</span>
            <Row className="gap-1 items-center">
              {
                item.totalAmount !== item.unitPrice * item.quantity && (
                  <span className="text-[10px] text-foreground">
                    <del>{formatMAD(item.unitPrice * item.quantity)} MAD</del>
                  </span>
                )
              }
              <span className="text-[15px] font-medium text-foreground">
                {formatMAD(item.totalAmount)} MAD
              </span>
            </Row>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 self-center">
        <Button
          variant="outline"
          size="icon"
          className="h-[30px] w-[30px] rounded-lg border-border/50 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-[30px] w-[30px] rounded-lg border-border/50 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

function PictureArea({ product, selected, className }: { product: Product, selected: boolean, className?: string }) {
  return (

    <div className={cn("relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted", className)}>
      <ProductImage
        src={product.image || undefined}
        className="h-full w-full object-cover"
      />
      {selected && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 fill-white dark:fill-black" />
        </div>
      )}
    </div>
  )
}

