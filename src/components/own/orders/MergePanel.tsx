// import type { OrderItemsHook } from "@/application/orders/hooks/useOrderItems";
import type { ModalPhase } from "./LoadItemsModal";
import type { PrevOrderItemsHook } from "@/application/orders/hooks/usePrevOrderItems";
import Col from "@/components/shared/Col";
import { ProductImage } from "@/components/shared/ProductImage";
import Row from "@/components/shared/Row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { OrderItem } from "@/types";
import {
  Check,
  GitCompareArrows,
  AlertTriangle,
  Box,
  Layers,
  GitMerge
} from "lucide-react";
import { useState } from "react";


export default function MergePanel({
  setPhase,
  // orderItemHook,
  prevOrderItemHook,
  setOpen,
}: {
  setPhase: React.Dispatch<React.SetStateAction<ModalPhase>>;
  // orderItemHook: OrderItemsHook;
  prevOrderItemHook: PrevOrderItemsHook;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const allItems = Object.values(prevOrderItemHook.mergeItems)

  const handleClick = () => {
    setOpen(false)
  }
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full">
      <ScrollArea className="flex-1 min-h-0 w-full ">
        <MergeContent
          items={allItems}
        />
        <ScrollBar />
      </ScrollArea>

      <DialogFooter
        className="px-6 py-4 border-t bg-muted/30 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setPhase("loading")
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleClick}
          className="min-w-24 gap-1.5">
          Apply
          <Check className="h-3.5 w-3.5" />
        </Button>
      </DialogFooter>
    </div>
  )
}




function MergeContent({
  items,
}: {
  items: OrderItem[][]
}) {
  const itemsConflicted = items.filter((g) => g.length > 1)
  console.log("items with conflict : ", itemsConflicted)
  return (
    <Col className="flex-1 min-h-0 w-full px-2 ">
      <MergeStats items={items} />
      <ConflictList items={items} />
    </Col>
  )
}






function ConflictList({
  items
}: {
  items: OrderItem[][]
}) {
  const itemsWithConflicts = items.filter((item) => item.length > 1)
  return (
    <div className="flex-1">
      <div className="flex gap-2 px-4 py-2 ">
        <h1 className="uppercase text-sm ">Conflicts</h1>
      </div>
      <div className="flex flex-col gap-2">

        {
          itemsWithConflicts.map((items, i) => (
            <ConflictItem key={i} items={items} />
          ))
        }
      </div>
    </div>
  )
}




function ConflictItem({
  items
}: {
  items: OrderItem[]
}) {

  const product = items[0].product;
  const [isResolved, setIsResolved] = useState(false)

  return (
    <Col className="border px-4 py-2 rounded-lg gap-2 ">
      <Row className="items-center gap-2 justify-between">
        <Row className="items-center">
          <ProductImage
            src={product?.image || undefined}
            className="h-12 w-12 shrink-0 rounded-lg border bg-muted"
          />
          <div className="flex flex-col gap-2 px-4 py-3">
            <p className="text-sm font-medium ">
              {product?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              ({items.length}) conflicts
            </p>
          </div>
        </Row>
        <Button
          onClick={() => {
            setIsResolved(!isResolved)
          }}
          variant="outline"
          size="sm"
          className="h-7 cursor-pointer ">
          <GitCompareArrows />
          <span className="text-xs">Resolve conflicts</span>
        </Button>
      </Row>

      {
        isResolved ? (
          <MergeFix items={items} />
        ) : null
      }
    </Col>
  )
}




function MergeFix({
  items,
}: {
  items: OrderItem[]
}) {
  console.log("items", items)
  return (
    <div className="flex-1 w-full">
      <Row className="w-full ">
        <span>Start Resolving Conflicts</span>
      </Row>
      <Col className="gap-1">
        {
          items.map((item, i) => (
            <DiffLine key={i} item={item} />
          ))
        }
      </Col>
    </div>
  )
}

function DiffLine({ item }: { item: OrderItem }) {
  const {
    orderId,
    unitPrice,
    quantity,
    totalAmount,
    unit
  } = item
  return (
    <div
      className="flex flex-col"
    >
      <span className="uppercase">order #{orderId}</span>
      <span className="uppercase text-xs">
        {unitPrice} MAD x {quantity} {unit} = {totalAmount} MAD
      </span>
    </div>

  )
}




function MergeStats({ items }: { items: OrderItem[][] }) {
  const numItems = items.flat().length;
  const numUniques = items.length;
  const numConflicts = items.filter((g) => g.length > 1).length;
  const numResolved = items.filter((g) => g.length === 1).length;
  const numSingle = numUniques - numConflicts - numResolved;

  const pct = (n: number) =>
    numUniques > 0 ? `${((n / numUniques) * 100).toFixed(1)}%` : "0%";

  const stats = [
    {
      label: "Total items",
      value: numItems,
      icon: <Layers className="h-3.5 w-3.5" />,
      valueClass: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Unique products",
      value: numUniques,
      icon: <Box className="h-3.5 w-3.5" />,
      valueClass: "",
    },
    {
      label: "Conflicts",
      value: numConflicts,
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      valueClass: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Resolved",
      value: numResolved,
      icon: <Check className="h-3.5 w-3.5" />,
      valueClass: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {/* <div className="flex gap-2"> */}
      {/*   <h1 className="uppercase text-lg ">Statistics</h1> */}
      {/* </div> */}
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map(({ label, value, icon, valueClass }) => (
          <div
            key={label}
            className="bg-muted/50 rounded-lg px-3.5 py-3 flex flex-col gap-1.5 border"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {icon}
              {label}
            </span>
            <span className={`text-2xl font-medium leading-none ${valueClass}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Breakdown bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 bg-muted">
          <div
            className="h-full rounded-full bg-yellow-400/70 dark:bg-yellow-500/50 transition-all"
            style={{ width: pct(numConflicts) }}
          />
          <div
            className="h-full rounded-full bg-green-400/70 dark:bg-green-500/50 transition-all"
            style={{ width: pct(numResolved) }}
          />
          <div
            className="h-full rounded-full bg-border transition-all"
            style={{ width: pct(numSingle) }}
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { color: "bg-yellow-400/70 dark:bg-yellow-500/50 border border-yellow-400", label: `Needs review (${numConflicts})` },
            { color: "bg-green-400/70 dark:bg-green-500/50 border border-green-400", label: `Ready to apply (${numResolved})` },
            { color: "bg-border", label: `Single source (${numSingle})` },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
