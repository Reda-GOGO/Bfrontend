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
import AdditionalInfoCard from "@/components/own/products/AdditionalInfoCard";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

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
            <PricingStatsCard product={product} />
          </div>
        </div>

        <Separator className="bg-border/40" />

        <div className="grid grid-cols-1 @[760px]:grid-cols-1 gap-5">
          <AdditionalInfoCard product={product} />
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

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Product Overview
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
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
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-foreground leading-tight lowercase first-letter:uppercase">
            {product.name || "Untitled Product"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {product.description || "No description provided for this product."}
          </p>
        </div>

        {/* Stock indicator */}
        <div className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/30">
          <div className="flex items-center justify-between text-sm">
            <div className={cn("flex items-center gap-1.5 font-medium text-xs", stockStatus.color)}>
              <StockIcon className="w-3.5 h-3.5" />
              {stockStatus.label}
            </div>
            <span className="font-semibold text-sm tabular-nums">
              {formatNumber(product.availableQty)}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                {product.unit}
              </span>
            </span>
          </div>
          <Progress
            value={stockStatus.pct}
            className="h-1.5"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.units?.length || 0} Unit variant{(product.units?.length || 0) !== 1 ? "s" : ""}
          </Badge>
          {product.vendorName && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {product.vendorName}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-xs bg-primary/5 text-primary border-primary/15"
          >
            {product.unit} base unit
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PricingStatsCard ─────────────────────────────────────────────────────────

function PricingStatsCard({ product }: { product: Product }) {
  const profit = product.price - product.cost;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;
  const isHealthy = margin >= 20;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Pricing
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <StatBlock
            label="Selling Price"
            value={formatMAD(product.price)}
            sub="per unit"
            highlight
          />
          <StatBlock
            label="Cost Price"
            value={formatMAD(product.cost)}
            sub="per unit"
          />
          <StatBlock
            label="Unit Profit"
            value={formatMAD(profit)}
            sub={profit >= 0 ? "positive" : "negative"}
            trend={profit >= 0 ? "up" : "down"}
          />
          <StatBlock
            label="Margin"
            value={`${margin.toFixed(1)}%`}
            sub={isHealthy ? "healthy" : "low margin"}
            trend={isHealthy ? "up" : "down"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBlock({
  label,
  value,
  sub,
  highlight,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  trend?: "up" | "down";
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 space-y-1 border",
        highlight
          ? "bg-primary/5 border-primary/15"
          : "bg-muted/20 border-border/30"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p className={cn("text-base font-bold tabular-nums", highlight && "text-primary")}>
        {value}
      </p>
      {sub && (
        <p
          className={cn(
            "text-[11px] flex items-center gap-1",
            trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : trend === "down"
                ? "text-destructive"
                : "text-muted-foreground/60"
          )}
        >
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {trend === "down" && <TrendingDown className="w-3 h-3" />}
          {sub}
        </p>
      )}
    </div>
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

// ─── UnitConversionCard ───────────────────────────────────────────────────────

export function UnitConversionCard({ product }: { product?: Product }) {
  // Use real product units if available, otherwise fall back to demo data
  const units = product?.units ?? [];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Unit Variants
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {units.length} variant{units.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {units.length === 0 ? (
          <DemoUnits />
        ) : (
          units.map((unit, idx) => (
            <UnitRow key={unit.id} unit={unit} isBase={unit.isBase} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function UnitRow({
  unit,
  isBase,
}: {
  unit: { name: string; price: number; cost: number; quantityInBase: number; isBase: boolean };
  isBase: boolean;
}) {
  const profit = unit.price - unit.cost;
  const margin = unit.price > 0 ? (profit / unit.price) * 100 : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        isBase
          ? "bg-primary/[0.03] border-primary/20 dark:bg-primary/[0.06]"
          : "bg-muted/10 border-border/30 hover:bg-muted/20"
      )}
    >
      {/* Unit name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wide">
            {unit.name}
          </span>
          {isBase && (
            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 font-semibold">
              BASE
            </Badge>
          )}
        </div>
        {!isBase && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            = {unit.quantityInBase} base unit{unit.quantityInBase !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Price / cost */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold tabular-nums">{formatMAD(unit.price)}</p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          cost {formatMAD(unit.cost)}
        </p>
      </div>

      {/* Margin chip */}
      <div
        className={cn(
          "text-[11px] font-semibold px-2 py-1 rounded-lg tabular-nums shrink-0",
          margin >= 20
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
        )}
      >
        {margin.toFixed(0)}%
      </div>
    </div>
  );
}

/** Shown when no real units are available */
function DemoUnits() {
  const demo = [
    { name: "PCS", price: 200, cost: 120, quantityInBase: 1, isBase: true },
    { name: "BOX", price: 650, cost: 400, quantityInBase: 3, isBase: false },
    { name: "CARTON", price: 2200, cost: 1500, quantityInBase: 12, isBase: false },
  ];
  return (
    <div className="space-y-2">
      {demo.map((u) => (
        <UnitRow key={u.name} unit={u} isBase={u.isBase} />
      ))}
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
