import type { OrderItemsHook } from "@/application/orders/hooks/useOrderItems";
import Row from "@/components/shared/Row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, CheckCircle2, Hash, ListFilter, Loader2, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import Col from "@/components/shared/Col";
import { cn, formatMAD } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Order } from "@/types";
import {
  usePrevOrderItems,
  type filterType,
  type PrevOrderItemsHook
} from "@/application/orders/hooks/usePrevOrderItems";
import { Separator } from "@/components/ui/separator";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ORDER_TYPE_CONFIG,
  ORDER_TYPE_FALLBACK,
  ORDER_STATUS_CONFIG
} from "@/components/shared/Icons";
import { CheckMergingStatus } from "./CheckMergingItems";
import MergePanel from "./MergePanel";

export type ModalPhase = "loading" | "checking" | "merging";

export default function LoadItemsModal({
  hook
}: {
  hook: OrderItemsHook
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<ModalPhase>("loading");
  const prevOrderItemHook = usePrevOrderItems();
  return (
    <Dialog open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size={"sm"} >
          Previous Orders
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        className="flex flex-col w-full sm:max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Load Previous Orders</DialogTitle>
          <DialogDescription>
            Select products from previous orders to add &amp; merge them into the current order.
          </DialogDescription>
        </DialogHeader>
        <ModalContent
          phase={phase}
          orderItemHook={hook}
          prevOrderItemHook={prevOrderItemHook}
          setPhase={setPhase}
          setOpen={setOpen}
        />

      </DialogContent>
    </Dialog>
  );
}



function ModalContent({
  phase,
  orderItemHook,
  prevOrderItemHook,
  setPhase,
  setOpen,
}: {
  phase: ModalPhase;
  orderItemHook: OrderItemsHook;
  prevOrderItemHook: PrevOrderItemsHook
  setPhase: React.Dispatch<React.SetStateAction<ModalPhase>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>

}) {
  switch (phase) {
    case "loading":
      return <LoadOrderItems
        orderItemHook={orderItemHook}
        prevOrderItemHook={prevOrderItemHook}
        phase={phase}
        setOpen={setOpen}
        setPhase={setPhase}
      />;
    case "checking":
      return <CheckMergingStatus
        orderItemHook={orderItemHook}
        prevOrderItemHook={prevOrderItemHook}
        setPhase={setPhase}
        setOpen={setOpen} />;
    case "merging":
      return <MergePanel
        prevOrderItemHook={prevOrderItemHook}
        setPhase={setPhase}
        setOpen={setOpen}
      />;
    default:
      return <LoadOrderItems
        orderItemHook={orderItemHook}
        prevOrderItemHook={prevOrderItemHook}
        phase={phase}
        setOpen={setOpen}
        setPhase={setPhase}
      />;
  }
}
function LoadOrderItems({
  orderItemHook,
  prevOrderItemHook,
  phase,
  setOpen,
  setPhase
}: {
  orderItemHook: OrderItemsHook;
  prevOrderItemHook: PrevOrderItemsHook
  phase: ModalPhase;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPhase: React.Dispatch<React.SetStateAction<ModalPhase>>
}) {
  const isAdded = prevOrderItemHook.selected.size > 0;
  const selectedItems = prevOrderItemHook.selectedCount;
  const [isFilter, setIsFilter] = useState(true);
  const toogle = () => {
    setIsFilter(!isFilter);
    prevOrderItemHook.resetFilter();
  }
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full gap-4">
      <Col>
        <Row className="w-full px-4 items-center ">
          <Input
            placeholder="Search previous orders ..."
            value={prevOrderItemHook.search}
            onChange={(e) => prevOrderItemHook.setSearch(e.target.value)}
          />
          <Button
            onClick={toogle}
            variant={isFilter ? "default" : "outline"}
            size="sm"
          >
            <ListFilter />
          </Button>
        </Row>
        {
          isFilter && (

            <OrdersFilter
              filter={prevOrderItemHook.filter}
              setFilter={prevOrderItemHook.setFilter}
            />
          )
        }
      </Col>
      <OrdersList
        orderHook={prevOrderItemHook}
        orders={prevOrderItemHook.orders}
        hook={orderItemHook}
      />

      {
        isAdded && (
          <DialogFooter className="px-6 py-4 shrink-0 border-t">
            <Button onClick={() => { setOpen(false); orderItemHook.setSearch(""); }} variant="outline">Cancel</Button>
            <Button
              onClick={() => { setPhase("checking"); orderItemHook.setSearch(""); }}
              variant="default">
              ({selectedItems}) Merge Items
            </Button>
          </DialogFooter>
        )
      }
    </div>
  );
}


function OrdersFilter({
  filter,
  setFilter
}: {
  filter: filterType,
  setFilter: React.Dispatch<React.SetStateAction<filterType>>
}) {
  const types = Object.values(ORDER_TYPE_CONFIG);
  const statuses = Object.values(ORDER_STATUS_CONFIG);
  const isEqualString = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  return (
    <div className="w-full flex flex-col gap-2 px-4 py-2 bg-background ">
      <Row className="w-full gap-8">
        <Label className="text-xs w-10 uppercase text-muted-foreground">type</Label>
        <Row className="flex w-full gap-2 flex-wrap">
          {types.map(({ icon: Icon, label }, idx) => (
            <Button key={idx}
              variant={isEqualString(filter.type, label) ? "default" : "outline"}
              onClick={() => setFilter({ ...filter, type: label.toLowerCase() })}
              className=" text-xs h-7  
              px-4 py-1 rounded-full  
              transition-all duration-200 border-2 ">
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </Button>
          ))}
        </Row>
      </Row>
      <Row className="w-full gap-8">
        <Label className="text-xs w-10 uppercase text-muted-foreground">status</Label>
        <Row className="flex w-full gap-2 flex-wrap">
          {statuses.map(({ icon: Icon, label }, idx) => (
            <Button key={idx}
              variant={isEqualString(filter.status, label) ? "default" : "outline"}
              onClick={() => setFilter({ ...filter, status: label.toLowerCase() })}
              className="text-xs h-7  
              px-4 py-1 rounded-full  
              transition-all duration-200 border-2">
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </Button>
          ))}
        </Row>
      </Row>
    </div>
  )
}

function OrdersList({
  orderHook,
  orders,
  hook
}: {
  orders: Order[];
  hook: OrderItemsHook;
  orderHook: PrevOrderItemsHook;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full w-full px-4">
        <div className="flex flex-col gap-2 pb-4">
          {
            orders.map((order) => (
              <OrderCard
                orderHook={orderHook}
                key={order.id}
                order={order}
                hook={hook}
              />
            ))
          }
        </div>
        <ScrollBar />
      </ScrollArea >
    </div >
  );
}


function OrderCard({
  order,
  hook,
  orderHook
}: {
  order: Order;
  hook: OrderItemsHook
  orderHook: PrevOrderItemsHook;
}) {
  const initials = order.customer?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusStyles: Record<string, string> = {
    confirmed: "bg-green-50 text-green-800",
    pending: "bg-amber-50 text-amber-900",
    cancelled: "bg-red-50 text-red-800",
  };
  const { addItem, removeItem, patchItem, selected } = orderHook;
  const isAdded = selected.has(order.id);

  const statusKey = (order.status ?? "pending").toLowerCase();

  return (
    <div className={cn("flex items-center gap-4 px-5 py-4 bg-background border-2 rounded-xl",
      isAdded ? "border-emerald-400" : ""
    )}>
      {/* <Checkbox /> */}

      <Col className="w-full gap-2">
        <Row className="w-full items-center gap-2">
          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Hash className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground/60">
                ORD {order.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-medium text-blue-800 shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium truncate">{order.customer?.name}</span>

            </div>

          </div>


          <Separator orientation="vertical" className="h-8" />

          {/* Type */}
          <TypeBadge type={order.type} />
          {/* Status */}
          <StatusBadge status={order.status} />
          <Separator orientation="vertical" className="h-8" />

          {/* Financials */}
          <div className="flex gap-5 shrink-0">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-0.5">Subtotal</p>
              <span className="text-sm font-medium">{formatMAD(order.totalAmount * 10000)} MAD</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-0.5">Total</p>
              <span className="text-sm font-medium">{formatMAD(order.totalAmountWithTax * 10000)} MAD</span>
            </div>
          </div>

        </Row>

        <Separator orientation="horizontal" className="h-8" />
        {/* Items */}
        <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
          <Row className="w-full items-center gap-2">

            <div className="w-full flex items-center gap-1.5 font-medium">
              <Calendar className="h-3 w-3" />
              <span>
                Created {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "full" })}
              </span>
            </div>
          </Row>
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">

            <Package className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{order.items?.length} item(s)</span>
          </div>
        </div>
      </Col>
      {/* <Button variant="secondary" size="default" className="shrink-0 "> */}
      {/*    <ChevronDown className="w-4 h-4" />  */}
      {/*   Add */}
      {/* </Button> */}
      <Switch className="bg-green-300 data-[state=checked]:bg-green-300"
        checked={isAdded}
        onCheckedChange={() => isAdded ? removeItem(order.id) : addItem(order)}
      />
    </div>
  );
}


function TypeBadge({ type }: { type?: string }) {
  const key = (type ?? "").toLowerCase().replace(/\s+/g, "_");
  const cfg = ORDER_TYPE_CONFIG[key] ?? ORDER_TYPE_FALLBACK;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium",
        cfg.bg, cfg.text, cfg.border
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const key = (status ?? "pending").toLowerCase().replace(/\s+/g, "_");
  const cfg = ORDER_STATUS_CONFIG[key] ?? ORDER_STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium",
        cfg.bg, cfg.text, cfg.border
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {cfg.label}
    </span>
  );
}
