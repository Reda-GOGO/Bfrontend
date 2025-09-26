import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Truck,
  ClipboardList,
  FileSignature,
  BadgeCheck,
  Clock,
  CircleSlash,
  DollarSign,
  Hourglass,
} from "lucide-react";
import { useOrderContext } from "@/contexts/orderContext";

// Define order types and icons
const ORDER_TYPES = [
  {
    label: "Invoice",
    value: "invoice",
    icon: <FileText className="w-4 h-4 mr-2" />,
  },
  {
    label: "Purchase Order",
    value: "purchase",
    icon: <ClipboardList className="w-4 h-4 mr-2" />,
  },
  {
    label: "Delivery Order",
    value: "delivery",
    icon: <Truck className="w-4 h-4 mr-2" />,
  },
  {
    label: "Estimate",
    value: "estimate",
    icon: <FileSignature className="w-4 h-4 mr-2" />,
  },
];

// Define status types and icons
const STATUSES = [
  {
    label: "Pending",
    value: "pending",
    icon: <Hourglass className="w-4 h-4 mr-2 text-yellow-500" />,
  },
  {
    label: "Partially Paid",
    value: "partially_paid",
    icon: <DollarSign className="w-4 h-4 mr-2 text-blue-500" />,
  },
  {
    label: "Paid",
    value: "paid",
    icon: <BadgeCheck className="w-4 h-4 mr-2 text-green-600" />,
  },
  {
    label: "Canceled",
    value: "canceled",
    icon: <CircleSlash className="w-4 h-4 mr-2 text-red-600" />,
  },
];

export default function TypeForm() {
  const { type, setType, setStatus, status } = useOrderContext();

  const isInvoice = type === "invoice";
  const selectedOrderType = ORDER_TYPES.find((o) => o.value === type);
  const selectedStatus = STATUSES.find((s) => s.value === status);
  return (
    <Card className="w-full border-muted shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Create New Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Type Select */}
        <div className="space-y-1">
          <Label htmlFor="order-type" className="text-sm font-medium">
            Order Type
          </Label>
          <Select
            onValueChange={(value) => {
              setType(value);
              if (value === "invoice") {
                setStatus("paid");
              } else {
                setStatus("");
              }
            }}
          >
            <SelectTrigger id="order-type" className="w-full">
              <SelectValue
                placeholder="Select order type"
                className="flex items-center"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order Types</SelectLabel>
                {ORDER_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="flex items-center"
                  >
                    {type.icon}
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Status Select */}
        <div className="space-y-1">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          {isInvoice ? (
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-green-600" />
              Paid (Auto-set for Invoice)
            </div>
          ) : (
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue
                  placeholder="Select status"
                  className="flex items-center"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {STATUSES.map((s) => (
                    <SelectItem
                      key={s.value}
                      value={s.value}
                      className="flex items-center"
                    >
                      {s.icon}
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
