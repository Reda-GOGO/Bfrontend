import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ArrowUpRightIcon,
  CheckCircle2,
  Group,
  Layers,
  Loader2,
  Package,
  Search,
  X,
} from "lucide-react";

export default function CollectionProductsCard({
  collection,
  products,
  search,
  isProductSelected,
  toggleProduct,
  setSearch,
  isLoading,
  hasMore,
  loadMore,
}: {
  collection: Collection;
  products: Product[];
  search: string;
  isProductSelected: (productId: number) => boolean;
  toggleProduct: (product: Product) => void;
  setSearch: React.SetStateAction<string>;
}) {
  const [isSearch, setIsSearch] = useState(false);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Collection Product(s)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 h-full">
        <Dialog open={isSearch} onOpenChange={setIsSearch}>
          <DialogTrigger asChild>
            <div className="flex w-full gap-3 max-md:flex-col">
              <div className="flex relative w-full ">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="search for product"
                  className="pl-8"
                ></Input>
              </div>
              <Button type="button">Browse &amp; Add Products</Button>
            </div>
          </DialogTrigger>

          <BrowseProducts
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            isProductSelected={isProductSelected}
            toggleProduct={toggleProduct}
            search={search}
            setSearch={setSearch}
            products={products}
          />
        </Dialog>
        <SelectedProductsList
          toggleProduct={toggleProduct}
          collection={collection}
          setIsSearch={setIsSearch}
        />
      </CardContent>
    </Card>
  );
}
function BrowseProducts({
  products,
  search,
  isProductSelected,
  toggleProduct,
  setSearch,
  isLoading,
  hasMore,
  loadMore,
}: {
  products: Product[];
  search: string;
  isProductSelected: (productId: number) => boolean;
  toggleProduct: (product: Product) => void;
  setSearch: React.SetStateAction<string>;
}) {
  console.log("products in search : ", products);
  return (
    <DialogContent className="md:min-w-3xl ">
      <DialogHeader>
        <DialogTitle>Add Product(s) to your Collection</DialogTitle>
        <DialogDescription>
          Browser and add products belongs to specific collection
        </DialogDescription>
      </DialogHeader>
      <div className="flex relative w-full  ">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search for product"
          className="pl-8"
        ></Input>
      </div>
      <ProductsList
        products={products}
        isProductSelected={isProductSelected}
        toggleProduct={toggleProduct}
        isLoading={isLoading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
      {/* <DialogFooter> */}
      {/*   <DialogClose asChild> */}
      {/*     <Button variant="outline">Cancel</Button> */}
      {/*   </DialogClose> */}
      {/*   <DialogClose asChild> */}
      {/*     <Button type="button">Save changes</Button> */}
      {/*   </DialogClose> */}
      {/* </DialogFooter> */}
    </DialogContent>
  );
}

function ProductsList({
  products,
  isProductSelected,
  toggleProduct,
  isLoading,
  hasMore,
  loadMore,
}: {
  products: Product[];
  isProductSelected: (productId: number) => boolean;
  toggleProduct: (product: Product) => void;
}) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the bottom div is visible and we aren't already loading
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }, // Trigger only when the entire sentinel is visible
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <ScrollArea className="h-[420px] pr-4">
      <div className="flex w-full gap-2 flex-col">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isProductSelected={isProductSelected}
            toggleProduct={toggleProduct}
          />
        ))}

        {/* Sentinel Element */}
        <div ref={observerTarget} className="py-4 flex justify-center w-full">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading more products...</span>
            </div>
          ) : hasMore ? (
            <div className="h-4" /> // Invisible space to trigger next load
          ) : (
            <span className="text-xs text-muted-foreground opacity-50">
              No more products to show
            </span>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

function ProductCard({
  product,
  isProductSelected,
  toggleProduct,
}: {
  product: Product;
  isProductSelected: (productId: number) => boolean;
  toggleProduct: (product: Product) => void;
}) {
  const selected = isProductSelected(product.id);

  return (
    <div
      onClick={() => toggleProduct(product)}
      className={cn(
        "group relative flex w-full p-3 items-center gap-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
        selected
          ? "bg-primary/[0.03] border-primary ring-1 ring-primary/20 shadow-sm"
          : "bg-card hover:bg-accent/50 hover:border-accent-foreground/10",
      )}
    >
      {/* Product Image Wrapper */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        <ProductImage
          src={product.image}
          className="h-full w-full object-cover"
        />
        {selected && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 fill-white dark:fill-black" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm md:text-base  truncate">
            {product.name}
          </span>
          <Badge
            variant={selected ? "default" : "secondary"}
            className="font-mono text-[10px] shrink-0"
          >
            {formatMAD(product.price)} MAD
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Layers className="h-3 w-3" />
            <span>{product.units?.length || 0} Variants</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Qty: {product.availableQty}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center pl-2">
        <Switch
          checked={selected}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
}

import { Trash2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function SelectedProductsList({
  collection,
  setIsSearch,
  toggleProduct, // Add this to allow removing items from the list
}: {
  collection: Collection;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  toggleProduct: (product: Product) => void;
}) {
  const hasProducts = collection.products && collection.products.length > 0;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Selected Items ({collection.products?.length || 0})
        </span>
        {hasProducts && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => setIsSearch(true)}
          >
            <Plus className="mr-1 h-3 w-3" /> Add More
          </Button>
        )}
      </div>

      <Separator className="mb-4" />

      {!hasProducts ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/30">
          <EmptyProductsList setIsSearch={setIsSearch} />
        </div>
      ) : (
        <ScrollArea>
          <div className="flex flex-col gap-2 pr-4 pb-4 h-[450px]">
            {collection.products?.map((product) => (
              <SelectedProductItem
                key={product.id}
                product={product}
                onRemove={() => toggleProduct(product)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function SelectedProductItem({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex w-full p-3 items-center gap-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
        isHovered
          ? "bg-primary/[0.03] border-primary ring-1 ring-primary/20 shadow-sm"
          : "bg-card hover:bg-accent/50 hover:border-accent-foreground/10",
      )}
    >
      {/* Product Image Wrapper */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        <ProductImage
          src={product.image}
          className="h-full w-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 fill-white dark:fill-black" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm md:text-base  truncate">
            {product.name}
          </span>
          <Badge
            variant={isHovered ? "default" : "secondary"}
            className="font-mono text-[10px] shrink-0"
          >
            {formatMAD(product.price)} MAD
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Layers className="h-3 w-3" />
            <span>{product.units?.length || 0} Variants</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Qty: {product.availableQty} </span>
            <span className="font-bold">{product.unit} </span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center pl-2">
        <span
          className="group hover:border-red-500 w-8 h-8 flex border items-center justify-center rounded-sm"
          onClick={onRemove}
        >
          <X className="group-hover:text-red-500 w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useEffect, useRef, useState } from "react";
import type { Collection, Product } from "@/types";
import { ProductImage } from "@/components/shared/ProductImage";
import { cn, formatMAD } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function EmptyProductsList({
  setIsSearch,
}: { setIsSearch: React.SetStateAction<boolean> }) {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package />
          </EmptyMedia>
          <EmptyTitle>No Product Added Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any product yet, Start adding products to
            your collection .
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button
              onClick={(e) => setIsSearch(true)}
              variant="outline"
              type="button"
            >
              Add Product
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
