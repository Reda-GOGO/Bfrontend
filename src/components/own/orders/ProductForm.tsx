import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Hash,
  Layers,
  ListFilter,
  Loader2,
  Minus,
  Package,
  PackageMinus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useOrderCollectionLoader, type SelectedItem } from "@/application/orders/hooks/useOrder.ts";
import type { Collection, OrderItem, Product, ProductUnit } from "@/types/index.ts";
import { ProductImage } from "@/components/shared/ProductImage.tsx";
import { cn, formatMAD } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import Col from "@/components/shared/Col.tsx";
import Row from "@/components/shared/Row.tsx";
import { type OrderItemsHook } from "@/application/orders/hooks/useOrderItems";

export default function ProductForm({ hook }: { hook: OrderItemsHook }) {
  const [open, setOpen] = useState(false);

  const editOrderLine = (item: OrderItem) => {
    hook.setSearch(item.name);
    setOpen(true);
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full gap-2 items-center justify-center max-xl:flex-col ">
          <div
            className="flex relative w-3/5 max-xl:w-full"
            onClick={() => setOpen(true)}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search for product"
              onFocus={() => setOpen(true)}
              className="pl-8"
            ></Input>
          </div>
          <div className="grid grid-cols-2 max-xl:grid-cols-1 w-2/5 max-xl:w-full gap-2">
            <BrowserModal
              open={open}
              setOpen={setOpen}
              hook={hook}
            />
            <Button size={"sm"}>Previous Orders</Button>
          </div>
        </div>
        <div className="flex w-full flex-col py-4 gap-2 h-[600px]">
          <div className="flex w-full">
            <span className="text-sm uppercase text-muted-foreground">
              ({hook.selectedCount}) Selected Items
            </span>
          </div>
          {

            hook.orderItems.length > 0 ? (
              <OrderItems hook={hook} editOrderLine={editOrderLine} removeOrderLine={hook.removeItem} />
            )
              : (
                <EmptyProducts />
              )
          }

        </div>
      </CardContent>
    </Card>
  );
}

function OrderItems({
  hook,
  editOrderLine,
  removeOrderLine
}: {
  hook: OrderItemsHook,
  editOrderLine: (item: OrderItem) => void;
  removeOrderLine: (productId: number) => void;

}) {
  const { orderItems } = hook;
  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="flex flex-col gap-2 pb-4">
        {orderItems.map((item) => (
          <OrderLine
            key={item.product?.handle}
            item={item}
            editOrderLine={editOrderLine}
            removeOrderLine={removeOrderLine}
          />
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}


function OrderLine({
  item,
  editOrderLine,
  removeOrderLine

}: {
  item: OrderItem;
  editOrderLine: (item: OrderItem) => void;
  removeOrderLine: (productId: number) => void;
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
          onClick={() => editOrderLine(item)}
          size="icon"
          className="h-[30px] w-[30px] rounded-lg border-border/50 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          onClick={() => removeOrderLine(item.product.id)}
          size="icon"
          className="h-[30px] w-[30px] rounded-lg border-border/50 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

function BrowserModal({
  open,
  setOpen,
  hook,
}: {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  hook: OrderItemsHook
}) {
  return (
    <Dialog open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          Browse
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        className="flex flex-col w-full sm:max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Products</DialogTitle>
          <DialogDescription>Select products to add to the order.</DialogDescription>
        </DialogHeader>
        <Browser hook={hook} />

        <DialogFooter className="px-6 py-4 shrink-0 border-t">
          <Button onClick={() => { setOpen(false); hook.setSearch(""); }} variant="outline">Cancel</Button>
          <Button onClick={() => { setOpen(false); hook.setSearch(""); }} variant="default">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Browser({
  hook
}: {
  hook: OrderItemsHook
}) {
  const {
    search,
    setSearch,
    collectionHandle,
    setCollectionHandle,
    collectionName,
    setCollectionName,
    pagination,
    products,
    isLoading,
    loadMore,
    hasMore,
    selected, addItem, removeItem, patchItem,
    orderItems, totalAmount, hasUnverified,
    selectedCount
  } = hook;

  const totalPages = pagination.totalItems;
  const { collections } = useOrderCollectionLoader();
  const [show, setShow] = useState(true);


  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-2 pb-0 gap-4">
      <Row className="w-full items-center">
        <Input
          placeholder="Search products ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Badge className="flex p-2 h-8">
          <span className="text-sm">{collectionName}</span>
          <ChevronsUpDown className="ml-auto size-4" />
        </Badge>
        <Button onClick={() => setShow(!show)} variant="outline" size="sm">
          <ListFilter />
        </Button>
      </Row>
      {
        show && (
          <Filters
            collections={collections}
            totalPages={totalPages}
            filter={collectionHandle}
            setFilterName={setCollectionName}
            setFilter={setCollectionHandle}
          />
        )
      }
      {/* This wrapper is the key: gives ScrollArea a real pixel height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ItemsList
          products={products}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          selected={selected}
          addItem={addItem}
          removeItem={removeItem}
          patchItem={patchItem}
        />
      </div>
    </div>
  );
}

function Filters({
  collections,
  totalPages,
  setFilter,
  filter,
  setFilterName,
}: {
  collections: Collection[],
  totalPages: number,
  setFilter: (collection: string) => void,
  filter: string,
  setFilterName: (collection: string) => void,
}) {
  return (
    <Row className="flex-wrap gap-1">
      {/* "All" Button */}
      <Button
        autoFocus
        onClick={() => { setFilterName("All Collections"); setFilter(""); }}
        className={cn("bg-primary/80 dark:bg-muted dark:text-primary text-xs h-7 px-4 py-1 rounded-full hover:bg-primary-dark  transition-all duration-200",
          filter === "" ? "outline-none ring-2 ring-green-400" : ""
        )}
      >
        <span>All</span>
        <span className="ml-2 rounded-full bg-background dark:bg-primary text-primary dark:text-background text-xs p-1 w-5 h-5 flex items-center justify-center font-semibold">
          {totalPages}
        </span>
      </Button>

      {/* Collection Buttons */}
      {collections.map((collection) => (
        <Button
          key={collection.handle}
          onClick={() => { setFilter(collection.handle); setFilterName(collection.name); }}
          className={cn("bg-gray-100 text-xs h-7 text-gray-800 px-4 py-1 rounded-full hover:bg-gray-200  transition-all duration-200",
            filter === collection.handle ? "outline-none ring-2 ring-green-400" : ""
          )}
        >
          <span>{collection.name}</span>
          <span className="ml-2 rounded-full bg-background text-primary text-xs p-1 w-5 h-5 flex items-center justify-center font-semibold">
            {collection._count?.products}
          </span>
        </Button>
      ))}
    </Row>

  )
}


function ItemsList({
  products,
  isLoading,
  hasMore,
  loadMore,
  selected,
  addItem,
  removeItem,
  patchItem,

}: {
  products: Product[],
  isLoading: boolean,
  hasMore: boolean,
  loadMore: () => void,
  selected: Map<number, SelectedItem>,
  addItem: (product: Product) => void,
  removeItem: (productId: number) => void,
  patchItem: (productId: number, patch: Partial<SelectedItem>) => void,
}) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="flex flex-col gap-2 pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.handle}
            product={product}
            selected={selected}
            addItem={addItem}
            removeItem={removeItem}
            patchItem={patchItem}

          />
        ))}
        <div ref={observerTarget} className="py-4 flex justify-center w-full">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading more products...</span>
            </div>
          ) : hasMore ? (
            <div className="h-4" />
          ) : (
            <span className="text-xs text-muted-foreground opacity-50">
              No more products to show
            </span>
          )}
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}


function ProductCard({
  product,
  selected,
  addItem,
  removeItem,
  patchItem
}: {
  product: Product,
  selected: Map<number, SelectedItem>,
  addItem: (product: Product) => void,
  removeItem: (productId: number) => void,
  patchItem: (productId: number, patch: Partial<SelectedItem>) => void
}) {
  const isAdded = selected.has(product.id);
  return (
    <div className={cn("group flex items-center gap-3.5 rounded-xl border-2 border-border bg-card px-4 py-3.5 transition-colors ",
      isAdded ?
        !selected.get(product.id)?.verified ?
          "border-green-400 "
          : "border-red-400 "
        :
        " "
    )}

    >

      {/* Product image */}
      <PictureArea
        product={product}
        selected={isAdded}
        className="h-[60px] w-[60px] min-w-[60px] rounded-lg border border-border/30 bg-muted object-cover"
      />

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">

        {/* Product name */}
        <span className="truncate text-sm font-bold text-foreground">
          {product.name}
        </span>

        {/* Unit / Price / Quantity — 3-column grid */}
        {
          isAdded ? (
            <div className="grid grid-cols-3 divide-x divide-border/50">
              <UnitInput
                isAdded={isAdded}
                product={product}
                patchItem={patchItem}
                selected={selected}
              />
              <PriceInput
                isAdded={isAdded}
                product={product}
                patchItem={patchItem}
                selected={selected}
              />
              <QuantityInput
                isAdded={isAdded}
                product={product}
                patchItem={patchItem}
                selected={selected}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 divide-x divide-border/50">
              <PriceView
                product={product}
                selected={selected}
              />
              <UnitView
                product={product}
                selected={selected}
              />
            </div>
          )
        }

        {/* Total row */}
        {
          isAdded && (
            <TotalAmount
              product={product}
              patchItem={patchItem}
              selected={selected}
            />
          )
        }
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 self-center">
        {isAdded ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeItem(product.id)}
            className="h-[30px] w-[30px] rounded-lg border-border/50 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

        ) : (
          <Button
            variant="default"
            //onClick={() => editOrderLine(item)}
            onClick={() => addItem(product)}
            size="icon"
            className="w-8 h-8 rounded-lg border-border/50  transition-colors hover:border-border "
          >
            <Plus className="h-3 w-3" />
          </Button>

        )
        }
      </div>
    </div>
  );
}


function PriceView({
  product,
  selected
}: {
  product: Product,
  selected: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 pl-3 ">
      <span className="text-[10px]  uppercase tracking-widest text-muted-foreground">
        price &amp; unit
      </span>
      <span className="text-[13px]   text-foreground">
        {formatMAD(product.price)} MAD &nbsp; / &nbsp;{product.unit}
      </span>
    </div>
  )
}

function UnitView({
  product,
  selected
}: {
  product: Product,
  selected: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 pl-3">
      <span className="text-[10px]  uppercase tracking-widest text-muted-foreground/70">
        unit variants
      </span>
      <span className="text-[13px]  text-foreground">
        {product.units?.length} &nbsp; variant(s)

      </span>
      <span className="text-[13px] text-foreground">
      </span>
    </div>
  )
}

function TotalAmount({ product, patchItem, selected }) {
  const [editing, setEditing] = useState(false);
  const item = selected.get(product.id)!;

  const computedTotal = parseFloat(parseFloat(item.unitPrice * item.quantity).toFixed(2));
  const hasCustomTotal = item.totalAmount !== computedTotal;

  const [draft, setDraft] = useState<number>(item.totalAmount);

  // Sync draft from external changes, but only when not editing
  useEffect(() => {
    if (!editing) {
      setDraft(item.totalAmount);
    }
  }, [item.totalAmount, editing]);

  // Reset totalAmount to computed ONLY when price or quantity actually changes
  const prevPriceRef = useRef(item.unitPrice);
  const prevQtyRef = useRef(item.quantity);

  useEffect(() => {
    const priceChanged = prevPriceRef.current !== item.unitPrice;
    const qtyChanged = prevQtyRef.current !== item.quantity;

    if (priceChanged || qtyChanged) {
      patchItem(product.id, { totalAmount: computedTotal });
    }

    prevPriceRef.current = item.unitPrice;
    prevQtyRef.current = item.quantity;
  }, [item.unitPrice, item.quantity]);

  const handleConfirm = () => {
    patchItem(product.id, { totalAmount: draft });
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(item.totalAmount);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between border-t border-border/50 pt-2">
      <span className="text-[11px] text-muted-foreground">
        {item.quantity} {item?.unitLabel} × {formatMAD(item.unitPrice)} MAD
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">Total</span>

        {hasCustomTotal && (
          <span className="text-[15px] font-medium text-foreground">
            <del>{formatMAD(computedTotal)} MAD</del>
          </span>
        )}

        {editing ? (
          <Row className="gap-0.5">
            <Input
              type="number"
              value={draft}
              onChange={(e) => setDraft(Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="Enter total"
              className="w-40 h-7 text-[13px] text-foreground text-center"
            />
            <Button variant="outline" onClick={handleConfirm} size="icon"
              className="h-7 w-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-500 hover:text-emerald-800">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleCancel} size="icon"
              className="h-7 w-7 bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-800">
              <X className="h-4 w-4" />
            </Button>
          </Row>
        ) : (
          <span className="text-[15px] font-medium text-foreground">
            {formatMAD(item.totalAmount)} MAD
          </span>
        )}

        <Button
          variant="outline"
          onClick={() => { setDraft(item.totalAmount); setEditing(true); }}
          size="icon"
          className={cn("h-7 w-7", editing ? "invisible" : "")}
        >
          <Pencil className="h-2 w-2 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

function PriceInput({
  isAdded,
  product,
  patchItem,
  selected
}: {
  isAdded: boolean,
  product: Product,
  patchItem: (productId: number, patch: Partial<SelectedItem>) => void,
  selected: Map<number, SelectedItem>
}) {
  const item = selected.get(product.id);
  const [price, setPrice] = useState<number>(item.unitPrice);
  const [editing, setEditing] = useState(false);
  const patchPrice = (price: number) => {
    patchItem(product.id, { unitPrice: price });
    setPrice(price);
  };

  useEffect(() => {
    setPrice(item.unitPrice);
  }, [item.unitPrice, item.unit]);

  return (

    <div className="flex flex-col gap-0.5 pl-3">

      <div className="flex justify-between items-center gap-2">

        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
          Unit price
        </span>
        <Button
          variant="outline"
          onClick={() => setEditing(true)}
          size="icon"
          className={cn("h-7 w-7", !editing ? "" : "invisible")}
        >
          <Pencil className="h-4 w-4 text-muted-foreground " />
        </Button>
      </div>
      {
        editing ? (
          <Row className="gap-0.5">
            <Input
              type="number"
              value={price}
              onChange={(e) => patchPrice(Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              placeholder="Enter unit"
              className="h-7 text-[13px] text-foreground text-center"
            />

            <Button
              variant="outline"
              onClick={() => setEditing(false)}
              size="icon"
              className="h-7 w-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-500 hover:text-emerald-800"
            >
              <Check className="h-4 w-4  " />
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditing(false)}
              size="icon"
              className="h-7 w-7 bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-800"
            >
              <X className="h-4 w-4  " />
            </Button>
          </Row>

        ) : (
          <Row className="gap-1 items-center">
            {price !== item.unit.price && (
              <span className="text-[10px] text-foreground">
                <del>{formatMAD(item.unit.price)} MAD</del>
              </span>
            )}
            <span className="text-[13px] text-foreground">
              {formatMAD(price)} MAD
            </span>

          </Row>

        )
      }
    </div>
  )
}


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
function UnitInput({ isAdded, product, patchItem, selected }) {
  const item = selected.get(product.id);
  const savedLabel = item.unitLabel;

  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState<string>(savedLabel);

  // Sync draft when item changes externally (e.g. dialog reopened)
  useEffect(() => {
    if (!isRenaming) {
      setDraft(savedLabel);
    }
  }, [savedLabel, isRenaming]);

  const handleUnitSelect = (unit: ProductUnit) => {
    patchItem(product.id, { unitLabel: unit.name, unit: unit, unitPrice: unit.price });
  };

  const handleConfirm = () => {
    patchItem(product.id, { unitLabel: draft });
    setIsRenaming(false);
  };

  const handleCancel = () => {
    setDraft(savedLabel); // revert to last saved
    setIsRenaming(false);
  };

  const isRenamed = savedLabel !== product.unit;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
          Unit
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => { setDraft(savedLabel); setIsRenaming(true); }}
          className={cn("h-7 w-7", isRenaming ? "invisible" : "")}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center w-full gap-2">
        {isRenaming ? (
          <Row className="gap-0.5">
            <Input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="Enter unit label"
              className="h-7 text-[13px] text-foreground text-center"
              autoFocus
            />
            <Button
              variant="outline"
              onClick={handleConfirm}
              size="icon"
              className="h-7 w-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-500 hover:text-emerald-800"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              size="icon"
              className="h-7 w-7 bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </Row>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex text-[13px] items-center gap-1.5">
                {savedLabel !== item.unit.name ? (
                  <>
                    <del className="text-muted-foreground">{item.unit.name}</del>
                    <span>{savedLabel}</span>
                  </>
                ) : (
                  <span>{savedLabel}</span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={savedLabel} onValueChange={handleUnitSelect}>
                {product.units?.map((u) => (
                  <DropdownMenuRadioItem className="h-7" key={u.name} value={u}>
                    <div className="flex items-center gap-2">
                      {u.name}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

function QuantityInput({
  isAdded,
  product,
  patchItem,
  selected
}: {
  isAdded: boolean,
  product: Product,
  patchItem: (productId: number, patch: Partial<SelectedItem>) => void,
  selected: Map<number, SelectedItem>
}) {
  const quantity = selected.get(product.id)?.quantity ?? 1;

  return (
    <div className="flex flex-col gap-0.5 pl-3">

      <div className="flex justify-between items-center gap-2">

        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
          Quantity
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 invisible"
        >
          <Pencil className="h-4 w-4 text-muted-foreground " />
        </Button>
      </div>
      <div className="flex gap-1">

        <Button
          variant="default"
          size="icon"
          onClick={() => patchItem(product.id, { quantity: quantity - 1 })}
          className="h-7 w-7"
        >
          <Minus className="h-4 w-4  " />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => patchItem(product.id, { quantity: Number(e.target.value) })}
          onWheel={(e) => e.currentTarget.blur()}
          className="h-7 text-[13px] text-foreground text-center" />

        <Button
          variant="default"
          onClick={() => patchItem(product.id, { quantity: quantity + 1 })}
          size="icon"
          className="h-7 w-7"
        >
          <Plus className="h-4 w-4  " />
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



function EmptyProducts() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageMinus />
          </EmptyMedia>
          <EmptyTitle>No Product Added Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any product yet, Start adding products to
            your collection .
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" type="button">
              Add Product
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
