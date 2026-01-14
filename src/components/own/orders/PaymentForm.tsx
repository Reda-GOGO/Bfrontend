import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Banknote,
  CreditCard,
  Receipt,
  Wallet,
  AlertCircle,
  Hash,
  Settings2,
} from "lucide-react";

const getTotalInWordsFr = (num: number) =>
  "Douze mille trois cent quarante dirhams et quarante-cinq centimes";

export default function PaymentForm() {
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Reference State
  const [isManualPayRef, setIsManualPayRef] = useState(false);
  const [payReference, setPayReference] = useState("");

  const totalAmount = 12340.45;
  const remainingAmount = totalAmount - paidAmount;

  return (
    <Card className="w-full shadow-sm border rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Payment Summary
          </CardTitle>
          <Badge
            variant={paymentStatus === "paid" ? "default" : "outline"}
            className="capitalize"
          >
            {paymentStatus.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* --- PAYMENT CONFIGURATION --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Mode</Label>
            <Select defaultValue="espece">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="espece">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5" /> Espèce
                  </div>
                </SelectItem>
                <SelectItem value="cheque">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5" /> Chèque
                  </div>
                </SelectItem>
                <SelectItem value="effet">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-3.5 h-3.5" /> Effet
                  </div>
                </SelectItem>
                <SelectItem value="virement">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Virement
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially-paid">Partially Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- PAYMENT REFERENCE (NEW SECTION) --- */}
        <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
              <Label
                htmlFor="pay-ref-mode"
                className="text-xs font-medium cursor-pointer"
              >
                Personalize Pay. Reference
              </Label>
            </div>
            <Switch
              id="pay-ref-mode"
              checked={isManualPayRef}
              onCheckedChange={setIsManualPayRef}
            />
          </div>

          <div className="relative">
            <Hash
              className={`absolute left-3 top-2.5 h-4 w-4 transition-colors ${isManualPayRef ? "text-primary" : "text-muted-foreground/30"
                }`}
            />
            <Input
              placeholder="Ex: CHQ-99203 / VIR-202"
              value={payReference}
              onChange={(e) => setPayReference(e.target.value)}
              disabled={!isManualPayRef}
              className={`pl-9 h-9 text-sm transition-all ${isManualPayRef
                ? "bg-background border-primary/50"
                : "bg-muted/40 opacity-60 italic"
                }`}
            />
          </div>
        </div>

        {/* --- CONDITIONAL PARTIAL PAYMENT SECTION --- */}
        {paymentStatus === "partially-paid" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-4 border border-amber-200 bg-amber-50/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Partial Payment Details
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount Paid</Label>
                  <Input
                    type="number"
                    className="bg-background h-9"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Remaining Balance</Label>
                  <div className="h-9 flex items-center px-3 rounded-md border bg-white font-bold text-red-600 text-sm">
                    {remainingAmount.toLocaleString()} MAD
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* --- PRICING SECTION --- */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal (3 items)</span>
            <span>12 000,45 MAD</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="discount" className="text-xs font-medium">
                Discount (MAD)
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="0.00"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="extra-charge" className="text-xs font-medium">
                Add. Charge
              </Label>
              <Input
                id="extra-charge"
                type="number"
                placeholder="+ MAD"
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground pt-1">
            <span>Tax (20%)</span>
            <span>2 400,00 MAD</span>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-dashed">
            <span className="font-bold text-lg">Total</span>
            <span className="text-xl font-bold text-primary">
              12 340,45 MAD
            </span>
          </div>
        </div>

        {/* --- FRENCH WORDS --- */}
        <div className="p-3 border rounded-md bg-muted/50 text-[11px] italic text-muted-foreground leading-tight">
          "{getTotalInWordsFr(totalAmount)}"
        </div>
      </CardContent>
    </Card>
  );
}
