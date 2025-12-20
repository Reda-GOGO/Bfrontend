import { ProductImage } from "@/components/shared/ProductImage";
import { testProducts } from "./ProductSalesStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TopProductsGrid() {
  const products = testProducts.slice(0, 5);
  console.log("test products : ", products);
  return (
    <Card className="w-full flex max-sm:px-1">
      <CardHeader>
        <CardTitle> Top Selling Products</CardTitle>
        <CardDescription>
          Best performing products in the selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full py-1 px-2 ">
        <ScrollArea className="h-[290px] flex flex-col gap-2 ">
          <div className="w-full flex flex-col gap-2">
            {products.map((product, index) => {
              return <ProductCard product={product} key={index + 1} />;
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

import { Package, ShoppingCart, Layers, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function ProductCard({ product }: { product: typeof testProducts[0] }) {
  return (
    <div className="flex flex-col w-full p-2 gap-2">
      <div className="flex gap-2 items-center">
        <ProductImage src={product.image} />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm line-clamp-2 font-semibold">
            {product.name}
          </span>
          <span className="flex gap-2 font-bold text-green-400">
            <span className="text-sm">+ 12,900.65</span>
            <span className="text-sm">MAD</span>
          </span>
          <div className="flex w-full flex-col justify-center  gap-2 ">
            <div className=" flex w-full gap-2 items-center">
              <Stat
                icon={<Package className="w-4 h-4" />}
                value={"13 piecs(s) sold"}
              />
              <Separator orientation="vertical" />
              <Stat
                icon={<ShoppingCart className="w-4 h-4" />}
                value={"23 sale(s)"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex  gap-1">
      <div className="w-4 h-4">{icon}</div>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
