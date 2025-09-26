import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderContext } from "@/contexts/orderContext";
import { useEffect, useState } from "react";
import n2words from "n2words";

export default function PaymentForm() {
  const { orderItems, setTotalAmountString, setTotalAmount } =
    useOrderContext();
  const [discount, setDiscount] = useState(0);

  const subtotal = orderItems.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  const taxRate = 0.2;
  const taxAmount = subtotal * taxRate;
  const totalAfterDiscount = subtotal - discount;
  const total = totalAfterDiscount + taxAmount;

  const formatCurrency = (amount: number) => amount.toFixed(2);
  // Only translate the final total to French
  const getTotalInWordsFr = (amount: number) => {
    const [dirhams, centimes] = amount.toFixed(2).split(".");
    const dirhamsWords = n2words(parseInt(dirhams), { lang: "fr" });
    const centimesWords = parseInt(centimes) > 0
      ? ` et ${n2words(parseInt(centimes), { lang: "fr" })} centimes`
      : "";
    return `${dirhamsWords} dirhams${centimesWords}`;
  };

  const totalInWords = getTotalInWordsFr(total);
  useEffect(() => {
    setTotalAmount(parseFloat(formatCurrency(total)));
    setTotalAmountString(totalInWords);
  }, [total, totalInWords, setTotalAmount, setTotalAmountString]);

  return (
    <Card className="w-full  shadow-sm border rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal ({orderItems.length} items)</span>
          <span>MAD {formatCurrency(subtotal)}</span>
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="discount" className="text-sm font-medium">
            Discount (MAD)
          </Label>
          <Input
            id="discount"
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="Enter discount amount"
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tax (20%)</span>
          <span>MAD {formatCurrency(taxAmount)}</span>
        </div>

        <div className="border-t pt-4 flex justify-between items-center font-medium text-base">
          <span>Total</span>
          <span className="text-primary font-semibold">
            MAD {formatCurrency(total)}
          </span>
        </div>

        <div className="flex flex-col space-y-1 pt-4">
          <Label className="text-sm font-medium">
            Total Amount in French Words
          </Label>
          <div className="p-2 border rounded-md bg-muted text-sm text-muted-foreground leading-relaxed">
            {totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
