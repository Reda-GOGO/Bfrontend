// AdditionalInfoCard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MapPin,
  Truck,
  TrendingUp,
  TrendingDown,
  Package,
  Star,
  ChevronRight,
} from "lucide-react";
import type { Product, ProductUnit } from "@/types";

// ─── Formatting ───────────────────────────────────────────────────────────────

function formatMAD(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + " MAD";
}

function formatQty(value: number, unit: string) {
  return `${new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} ${unit}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Vendor = {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
};

type Props = {
  product?: Product;
  // fallback props for when used standalone
  price?: number;
  cost?: number;
  unit?: string;
  availableQty?: number;
  vendor?: Vendor;
  units?: ProductUnit[];
};

// ─── Root ─────────────────────────────────────────────────────────────────────


// ─── PriceTile ─────────────────────────────────────────────────────────────────

function PriceTile({
  label,
  value,
  accent,
  trend,
}: {
  label: string;
  value: string;
  accent?: boolean;
  trend?: "up" | "down";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5 space-y-1 transition-colors",
        accent
          ? "bg-primary/5 border-primary/20 dark:bg-primary/10"
          : "bg-muted/15 border-border/30"
      )}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-black tabular-nums leading-tight",
          accent && "text-primary",
          trend === "up" && "text-emerald-600 dark:text-emerald-400",
          trend === "down" && "text-destructive"
        )}
      >
        {value}
      </p>
      {trend && (
        <div className={cn("flex items-center gap-0.5", trend === "up" ? "text-emerald-500" : "text-destructive")}>
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </div>
      )}
    </div>
  );
}

// ─── UnitRow ──────────────────────────────────────────────────────────────────

function UnitRow({ unit }: { unit: ProductUnit }) {
  const margin = unit.price > 0 ? ((unit.price - unit.cost) / unit.price) * 100 : 0;
  const isHealthy = margin >= 20;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        unit.isBase
          ? "bg-primary/[0.04] border-primary/20 dark:bg-primary/[0.08]"
          : "bg-muted/10 border-border/25 hover:bg-muted/20"
      )}
    >
      {/* Name + base indicator */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide truncate">
            {unit.name}
          </span>
          {unit.isBase && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded px-1 py-0.5 uppercase tracking-wider shrink-0">
              <Star className="w-2 h-2" /> Base
            </span>
          )}
        </div>
        {!unit.isBase && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
            <ArrowLeftRight className="w-2.5 h-2.5" />
            {unit.quantityInBase} base unit{unit.quantityInBase !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Price / cost */}
      <div className="text-right shrink-0">
        <p className="text-xs font-bold tabular-nums">{formatMAD(unit.price)}</p>
        <p className="text-[10px] text-muted-foreground/60 tabular-nums">
          cost {formatMAD(unit.cost)}
        </p>
      </div>

      {/* Margin chip */}
      <div
        className={cn(
          "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums min-w-[36px] text-center",
          isHealthy
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
        )}
      >
        {margin.toFixed(0)}%
      </div>
    </div>
  );
}

// ─── DemoUnits (shown when product has no units) ──────────────────────────────

function DemoUnits({
  baseUnit,
  basePrice,
  baseCost,
}: {
  baseUnit: string;
  basePrice: number;
  baseCost: number;
}) {
  const demo: ProductUnit[] = [
    {
      id: 1,
      productId: 0,
      name: baseUnit.toUpperCase(),
      quantityInBase: 1,
      isBase: true,
      price: basePrice,
      cost: baseCost,
      defaultValue: 1,
      variantValue: 1,
      createdAt: new Date(),
      archived: false,
    },
    {
      id: 2,
      productId: 0,
      name: "BOX",
      quantityInBase: 12,
      isBase: false,
      price: basePrice * 12 * 0.92,
      cost: baseCost * 12,
      defaultValue: 1,
      variantValue: 12,
      createdAt: new Date(),
      archived: false,
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Unit Variants
        </p>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
          demo
        </Badge>
      </div>
      <div className="space-y-1.5">
        {demo.map((u) => (
          <UnitRow key={u.id} unit={u} />
        ))}
      </div>
    </div>
  );
}

// ─── ContactRow ───────────────────────────────────────────────────────────────

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 px-3.5 py-3 rounded-xl border border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors group">
      <div className="w-7 h-7 rounded-lg bg-background border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-0.5">
          {label}
        </p>
        <p className={cn("text-sm font-medium leading-snug", href && "text-primary group-hover:underline underline-offset-2")}>
          {value}
        </p>
      </div>
      {href && (
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors mt-1 shrink-0" />
      )}
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}

// ─── NoVendor ─────────────────────────────────────────────────────────────────

function NoVendor() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 rounded-xl border border-dashed border-border/40 bg-muted/10">
      <Package className="w-8 h-8 text-muted-foreground/25" />
      <p className="text-sm text-muted-foreground/50">No vendor linked</p>
      <p className="text-xs text-muted-foreground/40">
        Edit the product to add supplier details
      </p>
    </div>
  );
}
