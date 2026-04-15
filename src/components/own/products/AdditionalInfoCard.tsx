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

export default function AdditionalInfoCard({
  product,
  price: priceProp = 24,
  cost: costProp = 15,
  unit: unitProp = "kg",
  availableQty: qtyProp = 100.56,
  vendor: vendorProp = {
    name: "Global Coffee Supply Co.",
    phone: "+1 (555) 483-9921",
    address: "742 Evergreen Ave, Seattle, WA",
  },
  units: unitsProp,
}: Props) {
  // Resolve from product or individual props
  const price = product?.price ?? priceProp;
  const cost = product?.cost ?? costProp;
  const unit = product?.unit ?? unitProp;
  const availableQty = product?.availableQty ?? qtyProp;
  const units = product?.units ?? unitsProp ?? [];
  const vendor: Vendor = {
    name: product?.vendorName ?? vendorProp?.name,
    phone: product?.vendorContact ?? vendorProp?.phone,
    address: vendorProp?.address,
  };

  const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
  const profit = price - cost;
  const hasVendor = !!(vendor.name || vendor.phone || vendor.address);

  const [tab, setTab] = useState<"inventory" | "vendor">("inventory");

  const stockStatus =
    availableQty <= 0
      ? { label: "Out of stock", color: "text-destructive", bg: "bg-destructive/8 dark:bg-destructive/15", icon: AlertTriangle }
      : availableQty < 10
        ? { label: "Low stock", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/25", icon: AlertTriangle }
        : { label: "In stock", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/25", icon: CheckCircle2 };

  const StockIcon = stockStatus.icon;

  return (
    <Card className="w-full border-border/50 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="pb-0 pt-5 px-5">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Details
          </CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 h-5 text-muted-foreground/60 border-border/40"
          >
            Read only
          </Badge>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-border/40">
          {(["inventory", "vendor"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "pb-2.5 px-1 mr-5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px",
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground/60 hover:text-muted-foreground"
              )}
            >
              {t === "inventory" ? "Inventory & Units" : "Vendor"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-5">
        {/* ══════════════════════════════════════════
            TAB: INVENTORY & UNITS
        ══════════════════════════════════════════ */}
        {tab === "inventory" && (
          <div className="space-y-5">
            {/* Stock qty + status */}
            <div
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 border border-border/30",
                stockStatus.bg
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background/80 border border-border/40 flex items-center justify-center">
                  <Boxes className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-0.5">
                    Available Stock
                  </p>
                  <p className="text-xl font-black tabular-nums tracking-tight leading-none">
                    {formatQty(availableQty, unit)}
                  </p>
                </div>
              </div>
              <div className={cn("flex items-center gap-1.5 text-xs font-semibold", stockStatus.color)}>
                <StockIcon className="w-3.5 h-3.5" />
                {stockStatus.label}
              </div>
            </div>

            {/* Pricing mini-grid */}
            <div className="grid grid-cols-3 gap-2">
              <PriceTile label="Sell Price" value={formatMAD(price)} accent />
              <PriceTile label="Cost" value={formatMAD(cost)} />
              <PriceTile
                label="Margin"
                value={`${margin.toFixed(1)}%`}
                trend={profit >= 0 ? "up" : "down"}
              />
            </div>

            {/* Unit variants */}
            {units.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Unit Variants
                  </p>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                    {units.length} total
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {units.map((u) => (
                    <UnitRow key={u.id} unit={u} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty units state */}
            {units.length === 0 && (
              <DemoUnits baseUnit={unit} basePrice={price} baseCost={cost} />
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: VENDOR
        ══════════════════════════════════════════ */}
        {tab === "vendor" && (
          <div className="space-y-4">
            {hasVendor ? (
              <>
                {/* Vendor identity */}
                {vendor.name && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 dark:bg-primary/15 border border-primary/15 flex items-center justify-center shrink-0">
                      <Truck className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">
                        Supplier
                      </p>
                      <p className="font-bold text-base leading-tight">{vendor.name}</p>
                    </div>
                  </div>
                )}

                {/* Contact details */}
                <div className="space-y-1.5">
                  {vendor.phone && (
                    <ContactRow
                      icon={Phone}
                      label="Phone"
                      value={vendor.phone}
                      href={`tel:${vendor.phone}`}
                    />
                  )}
                  {vendor.address && (
                    <ContactRow
                      icon={MapPin}
                      label="Address"
                      value={vendor.address}
                    />
                  )}
                </div>
              </>
            ) : (
              <NoVendor />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
