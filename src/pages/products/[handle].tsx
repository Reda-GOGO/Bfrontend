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
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  ChevronDown,
  EllipsisVertical,
  ImageOff,
  Layers,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
} from "lucide-react";
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
        <ProductHeader />
        <div className="flex w-full gap-2  @max-[612px]:flex-col">
          <ProductHero product={product} />
          <ProductChart />
        </div>
        <Separator />
        <div className="flex w-full gap-2  @max-[612px]:flex-col">
          <UnitConversionCard />
          <AdditionalInfoCard />
        </div>
      </div>
    </Back>
  );
}

import { ArrowDown, ArrowUp, Warehouse } from "lucide-react";
import AdditionalInfoCard from "@/components/own/products/AdditionalInfoCard";

function UnitTile({
  label,
  price,
  cost,
  highlight = false,
}: {
  label: string;
  price: string;
  cost: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-2 space-y-2 transition ${highlight ? "ring-2 ring-primary/50 bg-primary/5" : "bg-background"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm max-sm:text-xs font-semibold tracking-wide">
          {label}
        </span>

        {highlight && <Badge className="text-[10px]">Default</Badge>}
      </div>

      <div className="text-lg max-sm:text-sm font-bold">{price}</div>

      <div className="text-xs text-muted-foreground">Cost {cost}</div>
    </div>
  );
}

export function UnitConversionCard() {
  return (
    <Card className="w-full max-w-3xl bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Unit Variant(s)</CardTitle>

          <Badge variant="secondary" className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            3 variants
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Conversion Group */}
        <div className="grid gap-4 grid-cols-[1fr_auto_1fr]">
          {/* Variant (left on desktop, top on mobile) */}
          <UnitTile label="1 BOX" price="650.00 MAD" cost="600.00 MAD" />

          {/* Arrows */}
          <div className="flex items-center justify-center">
            <div className="flex md:flex-col items-center gap-2 text-muted-foreground">
              <ArrowLeftRight className="w-4 h-4" />

              <span className="hidden md:block text-xs uppercase tracking-wider">
                converts to
              </span>
            </div>
          </div>

          {/* Default Unit */}
          <UnitTile
            label="3 PIECES (PCS)"
            price="200.00 MAD"
            cost="120.00 MAD"
            highlight
          />
        </div>

        <Separator />

        {/* Another Variant */}
        <div className="grid gap-4 grid-cols-[1fr_auto_1fr]">
          <UnitTile label="1 CARTON" price="2,200.00 MAD" cost="1,800.00 MAD" />
          <div className="flex items-center justify-center">
            <div className="flex md:flex-col items-center gap-2 text-muted-foreground">
              <ArrowLeftRight className="w-4 h-4" />

              <span className="hidden md:block text-xs uppercase tracking-wider">
                converts to
              </span>
            </div>
          </div>

          <UnitTile
            highlight
            label="12 PIECES (PCS)"
            price="2,200.00 MAD"
            cost="1,800.00 MAD"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductHeader() {
  const isMobile = useMediaQuery("(max-width : 767px)");
  const navigate = useNavigate();
  return (
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
        disabled
        className="capitalize"
      >
        update product{" "}
      </Button>
    </div>
  );
}
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
export function ProductHero({ product }: { product: Product }) {
  return (
    <div className="hero flex flex-col items-start  gap-6 @[612px]:w-1/2 rounded-xl border ">
      <span className="leading-none font-semibold pl-6 pt-6">
        Product Overview
      </span>
      <div className="flex @max-[1024px]:flex-col w-full flex-row items-start  gap-6  p-4">
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
          <p className="text-muted-foreground font-semibold text-lg">
            {formatNumber(product.price)} MAD
          </p>
          <p className="text-muted-foreground text-sm">{product.handle}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* <Badge variant="secondary">Price: MAD {product.price}</Badge> */}
            {/* <Badge variant="outline">Cost: MAD {product.cost}</Badge> */}
            {/* <Badge variant={product.margin > 40 ? "default" : "destructive"}> */}
            {/*   Margin: {product.margin.toFixed(1)}% */}
            {/* </Badge> */}
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
  return <ChartBarDefault />;
}

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

export function ChartBarDefault() {
  return (
    <Card className="bg-background @[612px]:w-1/2">
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[250px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
