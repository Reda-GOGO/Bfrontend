import React, { useState, useMemo } from "react";
import {
  FileText,
  Hash,
  Settings2,
  Truck,
  ShoppingCart,
  FileSearch,
  Ban,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Configuration for order types
const ORDER_TYPES = [
  {
    value: "facture",
    label: "Facture",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    value: "bl",
    label: "Bon de Livraison",
    icon: Truck,
    color: "text-orange-500",
  },
  {
    value: "bc",
    label: "Bon de Commande",
    icon: ShoppingCart,
    color: "text-green-500",
  },
  {
    value: "devis",
    label: "Devis",
    icon: FileSearch,
    color: "text-purple-500",
  },
  {
    value: "none",
    label: "Without (Empty)",
    icon: Ban,
    color: "text-slate-400",
  },
];

export default function TypeForm() {
  const [orderType, setOrderType] = useState<string>("none");
  const [isManualRef, setIsManualRef] = useState(false);
  const [reference, setReference] = useState("REF-2026-001");

  // Find the active icon to display in the SelectTrigger
  // const ActiveIcon = useMemo(() => {
  //   return ORDER_TYPES.find((t) => t.value === orderType)?.icon || FileText;
  // }, [orderType]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md border-muted-foreground/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          Order Configuration
        </CardTitle>
        <CardDescription>Define document type and reference ID</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Select Dropdown with Icons */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Document Type</Label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="w-full h-11">
              <div className="flex items-center gap-3">
                {/* <ActiveIcon className="w-4 h-4 text-primary" /> */}
                <SelectValue placeholder="Select type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {ORDER_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-3">
                    <type.icon className={`w-4 h-4 ${type.color}`} />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Reference Number
            </span>
          </div>
        </div>

        {/* Reference Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-dashed">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <div className="grid gap-0.5">
                <Label
                  htmlFor="manual-mode"
                  className="text-sm font-medium leading-none"
                >
                  Manual Entry
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Enable custom numbering
                </p>
              </div>
            </div>
            <Switch
              id="manual-mode"
              checked={isManualRef}
              onCheckedChange={setIsManualRef}
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Hash
                className={`absolute left-3 top-3 h-4 w-4 transition-colors ${isManualRef ? "text-primary" : "text-muted-foreground/30"
                  }`}
              />
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                disabled={!isManualRef}
                className={`pl-10 h-11 transition-all ${isManualRef
                  ? "border-primary ring-2 ring-primary/5"
                  : "bg-muted/50 text-muted-foreground opacity-70"
                  }`}
              />
            </div>
            {!isManualRef && (
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[12px] text-muted-foreground">
                  Auto-sequencing active
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
