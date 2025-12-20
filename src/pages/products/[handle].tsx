import Back from "@/components/own/Back";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ChevronDown, EllipsisVertical, ImageOff } from "lucide-react";
import ProductSalesChart, {
  testProducts,
} from "@/components/own/dashboard/ProductSalesStats";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function ProductOverview() {
  const { title } = useParams();
  const productHandle = title;
  const isMobile = useMediaQuery("(max-width : 767px)");
  const [product, setProduct] = useState<Product>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/${productHandle}`,
        );
        const data = await res.json();
        setProduct({
          ...data,
          profit: data.price - data.cost,
          margin: ((data.price - data.cost) / data.price) * 100,
          imagePreview: data.image
            ? `${import.meta.env.VITE_API_URL}${data.image}`
            : "",
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [productHandle]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  return (
    <Back>
      <div className="sm:p-6 space-y-6">
        <div className="flex gap-2 w-full justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="capitalize ">
                {isMobile ? (
                  <EllipsisVertical />
                ) : (
                  <>
                    more actions
                    <ChevronDown />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => navigate("/products/create")}
            size={"sm"}
            className="capitalize"
          >
            update product{" "}
          </Button>
        </div>
        <div className="flex w-full gap-2 max-sm:flex-col">
          <ProductHero product={product} />
          <ProductChart />
        </div>
        <Separator />
      </div>
    </Back>
  );
}
function ProductHero({ product }: { product: Product }) {
  return (
    <div className="flex flex-col items-start  gap-6 sm:w-1/2 rounded-xl border ">
      <span className="leading-none font-semibold pl-6 pt-6">
        Product Overview
      </span>
      <div className="flex flex-col w-full lg:flex-row items-start  gap-6  p-4">
        {product.image ? (
          <img
            src={product.imagePreview}
            alt={product.name}
            className="w-full lg:w-64 h-64 object-cover aspect-square rounded-xl border border-border shadow-sm"
          />
        ) : (
          <div className="flex justify-center items-center w-full lg:w-64 h-64 object-cover rounded-xl border border-border shadow-sm">
            <ImageOff className="w-16 h-16 " />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground text-sm">{product.handle}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">Price: MAD {product.price}</Badge>
            <Badge variant="outline">Cost: MAD {product.cost}</Badge>
            <Badge variant={product.margin > 40 ? "default" : "destructive"}>
              Margin: {product.margin.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductChart() {
  return (
    <ProductSalesChart
      products={testProducts}
      className="sm:w-1/2 bg-background "
    />
  );
}
