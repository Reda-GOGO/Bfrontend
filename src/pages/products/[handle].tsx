import Back from "@/components/own/Back";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  FileText,
  Info,
  Layers,
  LinkIcon,
  Package,
  Pencil,
  RefreshCw,
  Tag,
  TrendingUp,
  TrendingDown,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  DollarSign,
  Percent,
  User,
  Phone,
} from "lucide-react";
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import Col from "@/components/shared/Col";
import Row from "@/components/shared/Row";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMAD(value: number) {
  return `${formatNumber(value)} MAD`;
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function ProductOverview() {
  const { title } = useParams();
  const productHandle = title;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/${productHandle}`
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
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productHandle]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <ProductNotFound />;

  return (
    <Back>
      <div className="sm:p-6 space-y-5 max-w-screen-xl mx-auto">
        <ProductHeader productId={product.handle} product={product} />

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 @[760px]:grid-cols-[1fr_380px] gap-5">
          <ProductHero product={product} />
          <div className="flex flex-col gap-5">
            <ProductChart productName={product.name} />
            <AdditionalInfoCard product={product} />
          </div>
        </div>
      </div>
    </Back>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <Back>
      <div className="sm:p-6 space-y-5 animate-pulse">
        <div className="h-10 bg-muted rounded-lg w-48 ml-auto" />
        <div className="grid grid-cols-1 @[760px]:grid-cols-[1fr_380px] gap-5">
          <div className="h-[480px] bg-muted rounded-2xl" />
          <div className="flex flex-col gap-5">
            <div className="h-[180px] bg-muted rounded-2xl" />
            <div className="h-[280px] bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    </Back>
  );
}

function ProductNotFound() {
  return (
    <Back>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
        <Package className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-lg font-semibold">Product not found</p>
        <p className="text-sm text-muted-foreground">
          This product may have been removed or the URL is incorrect.
        </p>
      </div>
    </Back>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function ProductHeader({
  productId,
  product,
}: {
  productId: string;
  product: Product;
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
        <span className="hover:text-foreground transition-colors cursor-pointer">
          Products
        </span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-foreground truncate">
          {product.name}
        </span>
        <Badge
          variant="secondary"
          className={cn(
            "ml-2 shrink-0 text-[10px] font-semibold px-2",
            product.archived
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400"
          )}
        >
          {product.archived ? "Archived" : "Active"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              {isMobile ? (
                <EllipsisVertical className="w-4 h-4" />
              ) : (
                <>
                  <EllipsisVertical className="w-3.5 h-3.5" />
                  Actions
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Product Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh stock
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm gap-2">
              <Tag className="w-3.5 h-3.5" /> Apply discount
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm text-destructive gap-2">
              <Package className="w-3.5 h-3.5" /> Archive product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => navigate(`/products/update/${productId}`)}
          size="sm"
          className="h-8 text-xs gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          {isMobile ? "Edit" : "Edit Product"}
        </Button>
      </div>
    </div>
  );
}

// ─── ProductHero ──────────────────────────────────────────────────────────────

export function ProductHero({ product }: { product: Product }) {
  const stockStatus =
    product.availableQty <= 0
      ? { label: "Out of stock", color: "text-destructive", icon: AlertTriangle, pct: 0 }
      : product.availableQty < 10
        ? { label: "Low stock", color: "text-amber-600", icon: AlertTriangle, pct: 20 }
        : { label: "In stock", color: "text-emerald-600", icon: CheckCircle2, pct: 80 };

  const StockIcon = stockStatus.icon;

  const profit = product.price - product.cost;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;
  const trend = margin > 0 ? "up" : "down"
  const formatedMargin = margin.toFixed(2)
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Product Overview
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5 flex flex-col gap-4 h-full justify-around">
        {/* Image */}
        <div className="flex items-center justify-center w-full">

          <div className="group relative w-[400px] h-[400px] overflow-hidden rounded-xl border border-border/30 bg-muted/20 aspect-video flex items-center justify-center">
            <ProductImageCard product={product} className="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            {/* Floating handle pill */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-3 py-1">
              <LinkIcon className="w-3 h-3 opacity-70" />
              <code className="text-[11px] font-mono">/{product.handle}</code>
            </div>
          </div>
        </div>
        {/* Name + description */}
        <div className="space-y-2 ">
          <h2 className="text-xl font-black tracking-tight text-foreground leading-tight lowercase first-letter:uppercase">
            {product.name || "Untitled Product"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {product.description || "No description provided for this product."}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="flex w-full  ">
          <div className="grid grid-cols-3 divide-x divide-border/50 w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Selling Price
              </span>
              <span className="text-[16px] text-foreground">
                {formatMAD(product.price)}
              </span>

              <span className="text-[12px] uppercase text-muted-foreground">
                per  1 {product.unit}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Cost Price
              </span>
              <span className="text-[16px] text-foreground">
                {formatMAD(product.cost)}
              </span>
              <span className="text-[12px] uppercase text-muted-foreground">
                per  1 {product.unit}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 pl-3">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Margin Profit (%)
              </span>
              <span className="flex gap-2 text-[16px] text-foreground">
                {formatMAD(profit)} &nbsp;

                <span
                  className={cn(
                    "text-[11px] flex items-center gap-1",
                    trend === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground/60"
                  )}
                >
                  ({formatedMargin}%)
                  {trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {trend === "down" && <TrendingDown className="w-3 h-3" />}
                </span>
              </span>

            </div>
          </div>

        </div>


        {/* Unit Section */}

        <div className="flex h-full flex-col p-4 rounded-xl w-full gap-2">
          <span className="text-sm text-muted-foreground uppercase tracking-widest " >
            Unit &amp; Variants
          </span>
          <div className="grid grid-cols-2 gap-2  w-full" >
            <div className="flex p-1 flex-col">
              <span className="text-[12px] uppercase font-semibold text-muted-foreground/80">
                Default
              </span>
              <Badge
                variant={"outline"}
              >
                {product.unit}
              </Badge>
            </div>


            <div className="flex p-1 flex-col ">
              <span className="text-[12px] uppercase font-semibold text-muted-foreground/80">
                Variants
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[12px]">up to</span>
                <span className="font-bold ">
                  {product.units?.length || 1}
                </span>
                <Layers className="w-3 h-3 " />
                <span className="text-[12px]"> variant(s)</span>
              </span>
            </div>

          </div>

          {
            product.units?.length > 1 && (
              <div className="w-full">
                {
                  product.units?.filter(unit => unit.isBase === false)
                    .map((unit) => (
                      <Variants unit={unit} product={product} />
                    ))
                }
              </div>
            )
          }
        </div>


      </CardContent>
    </Card>
  );
}




function Variants({ unit, product }: { unit: ProductUnit; product: Product }) {
  const profit = unit.price - unit.cost;
  const margin = unit.price > 0 ? (profit / unit.price) * 100 : 0;
  const trend = margin > 0 ? "up" : "down";

  // ring math — r=19, circumference = 2π×19 ≈ 119.38
  const CIRC = 119.38;
  const offset = CIRC - (Math.min(Math.max(margin, 0), 100) / 100) * CIRC;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/40 bg-background">

      {/* ── Top: name + margin ring ── */}
      <div className="flex items-center justify-between border-b border-border/20 px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/90">
            Variant
          </span>
          <span className="text-[15px] font-medium tracking-tight text-foreground">
            {unit.name}
          </span>
        </div>

        {/* Ring gauge */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative h-12 w-12">
            <svg
              viewBox="0 0 48 48"
              className="h-12 w-12 -rotate-90"
            >
              {/* track */}
              <circle
                cx="24" cy="24" r="19"
                fill="none"
                className="stroke-border/30"
                strokeWidth="3.5"
              />
              {/* fill */}
              <circle
                cx="24" cy="24" r="19"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                className={cn(
                  "transition-all duration-700",
                  trend === "up"
                    ? "stroke-emerald-500 dark:stroke-emerald-400"
                    : "stroke-red-500 dark:stroke-red-400"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-medium text-foreground">
                {Math.round(margin)}%
              </span>
            </div>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
            margin
          </span>
        </div>
      </div>

      {/* ── Prices ── */}
      <div className="grid grid-cols-3 divide-x divide-border/20">
        {[
          { label: "Selling", value: formatMAD(unit.price), accent: "" },
          { label: "Cost", value: formatMAD(unit.cost), accent: "" },
          {
            label: "Profit",
            value: `${trend === "up" ? "+" : ""}${formatMAD(profit)}`,
            accent: trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          },
        ].map((col) => (
          <div key={col.label} className="flex flex-col gap-1 px-4 py-3.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/90">
              {col.label}
            </span>
            <span className={cn("text-[15px] font-medium tracking-tight text-foreground", col.accent)}>
              {col.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Conversion ── */}
      <div className="flex items-center gap-2 border-t border-border/20 px-4 py-2.5">
        <span className="mr-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
          Rate
        </span>

        <div className="flex h-[26px] items-center overflow-hidden rounded-full border border-border/40">
          <span className="flex h-full items-center px-2.5 text-[12px] font-medium text-foreground">
            {unit.variantValue}
          </span>
          <div className="h-full w-px bg-border/30" />
          <span className="flex h-full items-center bg-muted/40 px-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {unit.name}
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground/40">=</span>

        <div className="flex h-[26px] items-center overflow-hidden rounded-full border border-border/40">
          <span className="flex h-full items-center px-2.5 text-[12px] font-medium text-foreground">
            {unit.defaultValue}
          </span>
          <div className="h-full w-px bg-border/30" />
          <span className="flex h-full items-center bg-muted/40 px-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.unit}
          </span>
        </div>
      </div>

    </div>
  );
}

// ─── AdditionalInfoCard ─────────────────────────────────────────────────────────────────

function AdditionalInfoCard({ product }: { product: Product }) {
  const profit = product.price - product.cost;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;
  const isHealthy = margin >= 20;

  return (
    <Card className="border-border/50 shadow-sm h-full">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Additional Info
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-[4px] px-2">

          {/* Inventory Section */}
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.09em] ">
              Inventory
            </h3>
            <div className="flex items-center justify-between rounded-xl border-[0.5px]   p-3.5 px-[14px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  Available quantity
                </span>
                <div className="flex items-baseline gap-1.25">
                  <span className="text-[22px] font-medium leading-none tracking-tight ">
                    {product.availableQty}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] ">
                    {product.unit}
                  </span>
                </div>
              </div>

              {/* Status Badge: Change classes based on state (in, low, out) */}
              <div className="flex items-center gap-1.25 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                In stock
              </div>
            </div>
          </div>

          {/* Vendor Section */}
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.09em] ">
              Vendor
            </h3>
            <div className="overflow-hidden rounded-xl border-[0.5px] ">

              {/* Vendor Name Row */}
              <div className="flex items-center gap-3 px-[14px] py-[11px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-[0.5px] ">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="flex min-w-0 flex-col gap-px">
                  <span className="text-[10px] font-medium uppercase tracking-[0.07em] ">
                    Name
                  </span>
                  <span className="truncate text-[13px] font-medium ">
                    Atlas Supplies Co.
                  </span>
                </div>
              </div>

              {/* Vendor Contact Row */}
              <div className="flex items-center gap-3 border-t-[0.5px]  px-[14px] py-[11px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border-[0.5px] ">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="flex min-w-0 flex-col gap-px">
                  <span className="text-[10px] font-medium uppercase tracking-[0.07em] ">
                    Contact
                  </span>
                  <span className="truncate text-[13px] font-medium ">
                    +212 6 12 34 56 78
                  </span>
                </div>
              </div>

            </div>
          </div>


          <div className="flex flex-col gap-[4px] ">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.09em] ">
              Collection
            </h3>
            <div className="flex items-center justify-between rounded-xl border-[0.5px]   p-3.5 px-[14px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  Collection Name
                </span>
                <div className="flex items-baseline gap-1.25">
                  <span className="text-[22px] font-medium leading-none tracking-tight ">
                    {product.Collection ? product.Collection.name : "No Collection"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border-[0.5px]   p-3.5 px-[14px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  Collection Name
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <code className="text-[12px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground italic">
                    /{product.Collection ? product.Collection.handle : "No Collection"}
                  </code>
                </div>
              </div>
            </div>
          </div>



        </div>
      </CardContent>
    </Card>
  );
}


// ─── ProductImageCard ─────────────────────────────────────────────────────────

function ProductImageCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (product.image) {
    return (
      <img
        src={`${import.meta.env.VITE_API_URL}${product.image}`}
        alt={product.name}
        className={cn("object-cover transition-transform duration-700 group-hover:scale-105 ", className)}
      />
    );
  }
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 bg-muted/10", className)}>
      <Layers className="w-10 h-10 text-muted-foreground/20" />
      <span className="text-xs text-muted-foreground/40">No image uploaded</span>
    </div>
  );
}





// ─── Chart ────────────────────────────────────────────────────────────────────

const chartData = [
  { month: "Jan", revenue: 186000, orders: 24 },
  { month: "Feb", revenue: 305000, orders: 38 },
  { month: "Mar", revenue: 237000, orders: 31 },
  { month: "Apr", revenue: 73000, orders: 10 },
  { month: "May", revenue: 209000, orders: 27 },
  { month: "Jun", revenue: 214000, orders: 28 },
];

const chartConfig = {
  revenue: {
    label: "Revenue (MAD)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function ProductChart({ productName }: { productName?: string }) {
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);
  const lastTwo = chartData.slice(-2);
  const trendPct =
    lastTwo[0].revenue > 0
      ? (((lastTwo[1].revenue - lastTwo[0].revenue) / lastTwo[0].revenue) * 100).toFixed(1)
      : "0";
  const trendUp = parseFloat(trendPct) >= 0;

  return (
    <Card className="border-border/50 shadow-sm flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                Sales Revenue
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Jan – Jun 2024{productName ? ` · ${productName}` : ""}
            </CardDescription>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
              trendUp
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trendUp ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trendUp ? "+" : ""}
            {trendPct}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/30" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">
            Total 6-month revenue
          </p>
          <p className="text-sm font-bold tabular-nums">
            {formatMAD(totalRevenue / 100)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
