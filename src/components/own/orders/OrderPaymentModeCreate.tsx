import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOrderContext } from "@/contexts/orderContext";
import { Banknote, Landmark, CreditCard } from "lucide-react";

/* ----------------------------- payment modes ------------------------------ */

export const PAYMENT_MODES = [
  {
    label: "Cash",
    value: "espèce",
    icon: <Banknote className="h-4 w-4 mr-2 text-green-600" />,
  },
  {
    label: "Bank Transfer",
    value: "virement bancaire",
    icon: <Landmark className="h-4 w-4 mr-2 text-blue-600" />,
  },
  {
    label: "Cheque",
    value: "cheque",
    icon: <CreditCard className="h-4 w-4 mr-2 text-purple-600" />,
  },
];

/* --------------------------- main create component ------------------------- */

export default function OrderPaymentModeCreate() {
  const { paymentMode, setPaymentMode } = useOrderContext();

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {PAYMENT_MODES.map((mode) => {
            const selected = paymentMode === mode.value;

            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setPaymentMode(mode.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border p-4 text-left transition",
                  "hover:bg-muted/40",
                  selected && "border-primary bg-muted",
                )}
              >
                <div className="flex items-center text-sm font-medium">
                  {mode.icon}
                  {mode.label}
                </div>

                {selected && (
                  <Badge variant="default" className="capitalize">
                    Selected
                  </Badge>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
