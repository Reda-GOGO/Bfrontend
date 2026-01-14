import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Store,
  Navigation,
  Phone,
  User,
  Info,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ShippingForm() {
  const [shippingMethod, setShippingMethod] = useState<string>("delivery");
  const [shippingFee, setShippingFee] = useState<string>("0");

  return (
    <Card className="w-full shadow-sm border rounded-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Shipping & Logistics
            </CardTitle>
            <CardDescription className="text-xs">
              Manage delivery destination and costs
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Delivery Method</Label>
          <ToggleGroup
            type="single"
            value={shippingMethod}
            onValueChange={(val) => val && setShippingMethod(val)}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem
              value="delivery"
              variant="outline"
              className="flex items-center gap-2 h-10 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
            >
              <Truck className="w-4 h-4" />
              Standard Delivery
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pickup"
              variant="outline"
              className="flex items-center gap-2 h-10 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
            >
              <Store className="w-4 h-4" />
              Store Pickup
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {shippingMethod === "delivery" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Contact Person */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-xs">
                  Contact Person
                </Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="contact"
                    placeholder="Recipient Name"
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="phone"
                    placeholder="+212 ..."
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs">
                Shipping Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/50" />
                <Textarea
                  id="address"
                  placeholder="Street name, Building, City, ZIP code..."
                  className="pl-9 min-h-[80px] text-sm pt-2"
                />
              </div>
            </div>

            {/* Shipping Fee */}
            <div className="bg-muted/30 p-4 rounded-lg border border-dashed flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm font-semibold">Shipping Fee</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          This amount will be added to the total.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Standard delivery rate
                </p>
              </div>
              <div className="relative w-32">
                <span className="absolute right-3 top-2 text-xs font-semibold text-muted-foreground">
                  MAD
                </span>
                <Input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="h-9 pr-12 font-bold text-right text-blue-600"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Pickup State */
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-lg bg-muted/20 text-center">
            <Store className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Store Pickup Selected
            </p>
            <p className="text-xs text-muted-foreground/70">
              No shipping address or fees required.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
