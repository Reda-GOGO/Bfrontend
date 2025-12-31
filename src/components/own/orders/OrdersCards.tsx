import type { Order } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function OrdersCards({
  orders,
  handleSelection,
  isItemSelected,
  handleAllSelection,
  isAllItemsSelected,
}: {
  orders: Order[];
  handleSelection: (id: number) => void;
  isItemSelected: (id: number) => boolean;
  handleAllSelection: (orders: Order[]) => void;
  isAllItemsSelected: (orders: Order[]) => boolean;
}) {
  const navigate = useNavigate();
  if (orders.length === 0) {
    return <EmptyOrder />;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => {
        return (
          <OrderCard
            key={order.id}
            order={order}
            handleSelection={handleSelection}
            isItemSelected={isItemSelected}
          />
        );
      })}
    </div>
  );
}

function OrderCard({
  order,
  handleSelection,
  isItemSelected,
  handleAllSelection,
  isAllItemsSelected,
}: { order: Order }) {
  const navigate = useNavigate();

  const statusDef = getOrderStatus(order.status);
  const typeDef = getOrderType(order.type);
  const { id } = order;
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    navigate(`/orders/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      key={order.id}
      className="group cursor-pointer transition-all hover:bg-muted/40"
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isItemSelected(order.id)}
              onCheckedChange={() => handleSelection(order.id)}
            />

            <div className="space-y-1">
              <div className="flex items-center gap-8">
                <span className="font-medium leading-none">
                  Order #{order.id}
                </span>

                {statusDef && (
                  <Badge variant={statusDef.variant} className="gap-1 text-xs">
                    {statusDef.icon}
                    {statusDef.label}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <span className="uppercase">
                  {order.customer?.name ?? "Walk-in customer"}
                </span>
              </div>
            </div>
          </div>

          <OrderActions orderId={order.id} status={order.status} />
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-border" />

        {/* Meta */}
        <div className="flex items-center justify-between">
          {/* Type */}
          {typeDef && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {typeDef.icon}
              <span>{typeDef.label}</span>
            </div>
          )}

          {/* Total */}
          <div className="text-right">
            <div className="font-semibold text-base tabular-nums">
              {order.totalAmount.toLocaleString("fr-MA")} MAD
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-MA", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { EllipsisVertical, ShoppingCart } from "lucide-react";

export function EmptyOrder() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingCart />
        </EmptyMedia>
        <EmptyTitle>Orders Empty</EmptyTitle>
        <EmptyDescription>
          Start Creating Orders right now by clicking Create .
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Create
        </Button>
      </EmptyContent>
    </Empty>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrderStatus, getOrderType } from "./OrdersTables";
import { useNavigate } from "react-router";
function OrderActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
