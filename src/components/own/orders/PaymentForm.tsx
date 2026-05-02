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
import { formatMAD, getTotalInWordsFr } from "@/lib/utils";


export default function PaymentForm({ totalAmount }: { totalAmount: number }) {
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Reference State
  const [isManualPayRef, setIsManualPayRef] = useState(false);
  const [payReference, setPayReference] = useState("");

  const remainingAmount = totalAmount - paidAmount;
  const totalTax = totalAmount * 0.2;
  const totalWithTax = totalAmount + totalTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm"> Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal (3 items)</span>
          <span>MAD {formatMAD(totalAmount)}</span>
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="discount" className="text-sm font-medium">
            Discount (MAD)
          </Label>
          <Input
            id="discount"
            type="number"
            min={0}
            disabled
            placeholder="Enter discount amount"
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax (20%)</span>
          <span>MAD {formatMAD(totalTax)}</span>
        </div>

        <div className="border-t pt-4 flex justify-between items-center font-medium text-base">
          <span>Total</span>
          <span className="text-primary font-semibold">
            MAD {formatMAD(totalWithTax)}
          </span>
        </div>

        <div className="flex flex-col space-y-1 pt-4">
          <Label className="text-sm font-medium">
            Total Amount in French Words
          </Label>
          <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground leading-relaxed">
            {getTotalInWordsFr(totalWithTax)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
