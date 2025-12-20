import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types";
import {
  EllipsisVertical,
  ImageOff,
  Layers,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";

export function ProductCards({ products }: { products: Product[] }) {
  const navigate = useNavigate();

  const handleClick = (e: Event, handle: string) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    if (targetElement.tagName !== "BUTTON") {
      navigate(`/products/${handle}`);
    }
  };
  return (
    <div className="grid gap-4 p-2">
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No products found.
        </div>
      ) : (
        products.map((product) => {
          const price = parseFloat(product.price);
          const cost = parseFloat(product.cost);
          const profit = price - cost;
          const margin = price > 0 ? (profit / price) * 100 : 0;
          const isPositive = profit >= 0;

          return (
            <div
              onClick={(e: Event) => handleClick(e, product.handle)}
              key={product.id}
              className="rounded-xl border bg-card shadow-sm p-4 flex flex-col gap-4"
            >
              {/* TOP SECTION */}
              <div className="flex items-start justify-between">
                <div className="flex w-10 items-center  h-full">
                  <Checkbox />
                </div>
                {/* NAME + IMAGE */}
                <div className="w-full flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      className="h-16 w-16 rounded-md object-cover border shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md border shadow-sm flex items-center justify-center bg-secondary text-muted-foreground">
                      <ImageOff className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-base">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.availableQty} {product.unit} available
                    </p>
                  </div>
                </div>

                {/* MENU */}
                {/* <DropdownMenu> */}
                {/*   <DropdownMenuTrigger asChild> */}
                {/*     <Button */}
                {/*       variant="ghost" */}
                {/*       size="icon" */}
                {/*       className="h-8 w-8 text-muted-foreground" */}
                {/*     > */}
                {/*       <EllipsisVertical /> */}
                {/*     </Button> */}
                {/*   </DropdownMenuTrigger> */}
                {/**/}
                {/*   <DropdownMenuContent align="end" className="w-36"> */}
                {/*     <DropdownMenuItem>Edit</DropdownMenuItem> */}
                {/*     <DropdownMenuItem>Duplicate</DropdownMenuItem> */}
                {/*     <DropdownMenuItem>Favorite</DropdownMenuItem> */}
                {/*     <DropdownMenuSeparator /> */}
                {/*     <DropdownMenuItem className="text-red-600"> */}
                {/*       Delete */}
                {/*     </DropdownMenuItem> */}
                {/*   </DropdownMenuContent> */}
                {/* </DropdownMenu> */}
              </div>

              {/* UNITS */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                {product.units.length} variant(s)
              </div>

              {/* FINANCIAL DATA */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                {/* PRICE */}
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <div className="flex text-xs items-center gap-1 font-semibold">
                    {price.toFixed(2)} MAD
                  </div>
                </div>

                {/* PROFIT */}
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Profit</span>
                  <div
                    className={`flex text-xs items-center gap-1 font-semibold ${isPositive ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {profit.toFixed(2)}
                  </div>
                </div>

                {/* MARGIN */}
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Margin %
                  </span>

                  <span
                    className={`text-xs px-2 py-0.5 mt-0.5 rounded-full font-medium w-fit ${isPositive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                  >
                    {margin.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
