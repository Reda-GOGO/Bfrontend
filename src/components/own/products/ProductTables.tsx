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
import type { Product } from "@/types";

import { EllipsisVertical, ImageOff, Layers, Package } from "lucide-react";
import { useProductsSelection } from "@/application/products/hooks/useProducts";
import { useNavigate } from "react-router";

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
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground font-medium">
            No products found
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ProductImage({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="h-12 w-12 flex items-center justify-center bg-secondary/50 rounded-md border text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.VITE_API_URL}${src}`}
      className="h-12 w-12 object-cover rounded-md shadow-sm border"
    />
  );
}

function ProductActions() {
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

function ProductRow({
  product,
  handleSelection,
  isItemSelected,
}: {
  product: Product;
  handleSelection: (item: T) => void;
  isItemSelected: boolean;
}) {
  const { id, name, image, availableQty, unit, units, price, cost } = product;

  const profit = price - cost;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  const isPositive = profit >= 0;
  const navigate = useNavigate();
  const handleClick = (e: Event, handle: string) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    if (targetElement.tagName !== "BUTTON") {
      navigate(`/products/${handle}`);
    }
  };
  return (
    <TableRow
      onClick={(e) => handleClick(e, product.handle)}
      key={id}
      className="hover:bg-muted/50 transition-colors group"
    >
      <TableCell>
        <Checkbox
          checked={isItemSelected}
          onCheckedChange={() => handleSelection(id)}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <ProductImage src={image} />
          <span className="font-medium">{name}</span>
        </div>
      </TableCell>

      {/* <TableCell> */}
      {/*   <div className="flex flex-col"> */}
      {/*     <span className="font-semibold text-sm"> */}
      {/*       {availableQty} {unit} */}
      {/*     </span> */}
      {/*     <span className="text-xs text-muted-foreground"> */}
      {/*       {availableQty > 0 ? "In stock" : "Out of stock"} */}
      {/*     </span> */}
      {/*   </div> */}
      {/* </TableCell> */}

      <TableCell>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{units?.length}</span>
          <span className="text-xs text-muted-foreground">variants</span>
        </div>
      </TableCell>

      {/* <TableCell> */}
      {/*   <div className="flex items-center gap-1 font-semibold text-sm"> */}
      {/*     {price.toFixed(2)} MAD */}
      {/*   </div> */}
      {/* </TableCell> */}

      <TableCell>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPositive
            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
        >
          {margin.toFixed(2)}%
        </span>
      </TableCell>

      <TableCell>
        <ProductActions />
      </TableCell>
    </TableRow>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [loading] = useState(false);
  const {
    handleSelection,
    isItemSelected,
    handleAllSelection,
    isAllItemsSelected,
  } = useProductsSelection<number>();
  return (
    <div className="w-full rounded-xl border bg-card shadow-sm p-2">
      <Table>
        <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-xl z-10 border-b">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllItemsSelected(products)}
                onCheckedChange={() => handleAllSelection(products)}
              />
            </TableHead>

            <TableHead className="font-semibold">Product</TableHead>
            {/* <TableHead className="font-semibold">Inventory</TableHead> */}
            <TableHead className="font-semibold">Units</TableHead>
            {/* <TableHead className="font-semibold">Price</TableHead> */}
            <TableHead className="font-semibold">Margin %</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                handleSelection={handleSelection}
                isItemSelected={isItemSelected(p.id)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
