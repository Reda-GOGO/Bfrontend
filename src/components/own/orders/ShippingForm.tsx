import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Store,
  Phone,
  User,
  Info,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function ShippingForm() {
  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [shippingFee, setShippingFee] = useState<string>("0");

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border bg-card text-card-foreground overflow-hidden">
      {/* Dynamic Header */}
      <CardHeader className="bg-muted/30 border-b border-border pb-6 transition-colors">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight">
              Shipping & Logistics
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Manage destination and logistics preferences.
            </CardDescription>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Truck className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Method Selection - Adaptive Radio Cards */}
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            Delivery Method
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShippingMethod("delivery")}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                shippingMethod === "delivery"
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-secondary bg-secondary/20 hover:border-muted-foreground/30",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  shippingMethod === "delivery"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10",
                )}
              >
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Home Delivery</p>
                <p className="text-xs text-muted-foreground">
                  Door-to-door service
                </p>
              </div>
              {shippingMethod === "delivery" && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setShippingMethod("pickup")}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                shippingMethod === "pickup"
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-secondary bg-secondary/20 hover:border-muted-foreground/30",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  shippingMethod === "pickup"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10",
                )}
              >
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Local Pickup</p>
                <p className="text-xs text-muted-foreground">Self-collection</p>
              </div>
              {shippingMethod === "pickup" && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {shippingMethod === "delivery" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipient Info */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact"
                  className="text-sm font-semibold opacity-90"
                >
                  Recipient Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="contact"
                    placeholder="John Doe"
                    className="pl-10 bg-muted/20 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold opacity-90"
                >
                  Phone Number
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="phone"
                    placeholder="+212 6..."
                    className="pl-10 bg-muted/20 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-semibold opacity-90"
              >
                Shipping Address
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Textarea
                  id="address"
                  placeholder="Street name, City, Zip Code..."
                  className="pl-10 min-h-[100px] bg-muted/20 border-border focus:bg-background transition-all resize-none"
                />
              </div>
            </div>

            {/* Adaptive Shipping Fee Banner */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary-foreground/15 rounded-xl backdrop-blur-sm">
                  <PackageCheck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight">
                      Logistics Fee
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-primary-foreground/60 cursor-help hover:text-primary-foreground transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground shadow-2xl border-border">
                          <p className="text-xs font-medium">
                            Standard regional delivery rates apply.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-[11px] font-medium opacity-70">
                    Calculated for your region
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-xl border border-primary-foreground/20 backdrop-blur-md">
                <Input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-14 h-6 bg-transparent border-none text-right font-black text-primary-foreground focus-visible:ring-0 p-0 text-lg"
                />
                <span className="text-xs font-black opacity-80">MAD</span>
              </div>
            </div>
          </div>
        ) : (
          /* Dark Mode Friendly Empty State */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center justify-center py-14 px-6 border-2 border-dashed border-muted rounded-3xl bg-muted/10 group transition-all">
              <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-border">
                <Store className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Ready for Pickup</h3>
              <p className="text-sm text-muted-foreground text-center max-w-[260px] mt-2 leading-relaxed">
                Your order will be staged at our main hub. We'll alert you via
                SMS once it's ready.
              </p>
              <button className="mt-8 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Find Nearest Hub
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
