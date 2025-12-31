import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order, Product } from "@/types";

import { EllipsisVertical, Layers, ShoppingCart } from "lucide-react";
import { useProductsSelection } from "@/application/products/hooks/useProducts";
import { useNavigate } from "react-router";
import { useOrdersSelection } from "@/application/orders/hooks/useOrders";
import { ORDER_TYPES, STATUSES } from "@/pages/orders/Orders";
import { Badge } from "@/components/ui/badge";

function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={`loading-${i}`}>
          <TableCell colSpan={8}>
            <Skeleton className="h-12 w-full rounded-md p-2" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-16">
        <div className="flex flex-col items-center gap-3 opacity-80">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground font-medium">
            No orders found
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

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

export const getOrderType = (type: string) =>
  ORDER_TYPES.find((t) => t.value === type);

export const getOrderStatus = (status: string) =>
  STATUSES.find((s) => s.value === status);

function OrderRow({
  order,
  handleSelection,
  isItemSelected,
}: {
  order: Order;
  handleSelection: (id: number) => void;
  isItemSelected: boolean;
}) {
  const { id, totalAmount, status, type, customer, createdAt } = order;

  const navigate = useNavigate();

  const statusDef = getOrderStatus(status);
  const typeDef = getOrderType(type);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    navigate(`/orders/${id}`);
  };

  return (
    <TableRow
      onClick={handleClick}
      className="cursor-pointer transition-colors hover:bg-muted/40"
    >
      {/* Select */}
      <TableCell className="align-middle">
        <Checkbox
          checked={isItemSelected}
          onCheckedChange={() => handleSelection(id)}
        />
      </TableCell>

      {/* Order + Customer */}
      <TableCell className="py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium leading-tight">Order #{id}</span>
          <span className="text-sm text-muted-foreground">
            <span className="uppercase">
              {order.customer?.name ?? "Walk-in customer"}
            </span>
          </span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3">
        {statusDef && (
          <Badge variant={statusDef.variant} className="gap-1 text-xs">
            {statusDef.icon}
            {statusDef.label}
          </Badge>
        )}
      </TableCell>

      {/* Type */}
      <TableCell className="py-3">
        {typeDef && (
          <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            {typeDef.icon}
            <span>{typeDef.label}</span>
          </div>
        )}
      </TableCell>

      {/* Total */}
      <TableCell className="py-3 text-right">
        <span className="font-semibold tabular-nums">
          {totalAmount.toLocaleString("fr-MA")} MAD
        </span>
      </TableCell>

      {/* Date */}
      <TableCell className="py-3">
        <time className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString("en-MA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </time>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3">
        <OrderActions orderId={id} status={status} />
      </TableCell>
    </TableRow>
  );
}

export function OrdersTable({
  orders,
  handleSelection,
  isItemSelected,
  handleAllSelection,
  isAllItemsSelected,
}: { orders: Order[] }) {
  const [loading] = useState(false);

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm p-1">
      <Table>
        <TableHeader className="sticky top-0 z-10  backdrop-blur border-b">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllItemsSelected(orders)}
                onCheckedChange={() => handleAllSelection(orders)}
              />
            </TableHead>

            <TableHead className="font-medium">Order</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Type</TableHead>

            <TableHead className="font-medium text-right">Total</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                handleSelection={handleSelection}
                isItemSelected={isItemSelected(order.id)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
