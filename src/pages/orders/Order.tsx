import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BadgeCheck,
  ChevronDown,
  CircleSlash,
  ClipboardList,
  DollarSign,
  EllipsisVertical,
  FileSignature,
  FileText,
  Hourglass,
  ImageOff,
  Mail,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Back from "@/components/own/Back";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import OrderItems from "@/components/own/orders/OrderItems";
import OrderPayment from "@/components/own/orders/OrderPayment";
import OrderTimeline from "@/components/own/orders/OrderTimeline";
import OrderCustomer from "@/components/own/orders/OrderCustomer";
import { ORDER_TYPES, STATUSES } from "@/components/own/orders/TypeForm";

const ORDER_TYPE_ICONS: Record<string, JSX.Element> = {
  invoice: <FileText className="w-4 h-4 text-blue-500" />,
  delivery: <Truck className="w-4 h-4 text-green-500" />,
  purchase: <ClipboardList className="w-4 h-4 text-indigo-500" />,
  estimate: <FileSignature className="w-4 h-4 text-yellow-500" />,
};

const ORDER_STATUS = {
  paid: {
    label: "Paid",
    icon: <BadgeCheck className="w-4 h-4 text-green-600" />,
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  pending: {
    label: "Pending",
    icon: <Hourglass className="w-4 h-4 text-yellow-500" />,
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  partially_paid: {
    label: "Partially Paid",
    icon: <DollarSign className="w-4 h-4 text-blue-500" />,
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  canceled: {
    label: "Canceled",
    icon: <CircleSlash className="w-4 h-4 text-red-600" />,
    className: "bg-red-50 text-red-700 border border-red-200",
  },
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/${parseInt(id)}`,
        );
        if (!res.ok) {
          throw new Error("HTTP Status : ", res.status);
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Failed to fetch requested order ...", error);
      }
    };
    getOrder();
  }, []);
  const statusMeta =
    ORDER_STATUS[order && (order.status as keyof typeof ORDER_STATUS)];
  if (order) {
    return (
      <Back>
        <OrderHeader order={order} />
        <OrderLayout>
          <div className="col-span-2">
            <div className="flex gap-2 flex-col w-full">
              <OrderItems order={order} />
              <OrderPayment order={order} />
              <OrderTimeline order={order} />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <OrderCustomer order={order} />
            <OrderType order={order} />
            <OrderPaymentMode order={order} />
          </div>
        </OrderLayout>
      </Back>
    );
  }
}

function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:grid flex flex-col  md:grid-cols-3  gap-2  md:px-42 py-4">
      {children}
    </div>
  );
}

function DisplayRow({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

export function OrderType({ order }: { order: Order }) {
  const type = ORDER_TYPES.find((t) => t.value === order.type);
  const status = STATUSES.find((s) => s.value === order.status);

  return (
    <div className="w-full row-span-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Type &amp; Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Type */}
          {type && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Order Type
              </p>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center text-sm font-medium">
                  {type.icon}
                  {type.label}
                </div>

                <Badge variant="secondary">{type.value}</Badge>
              </div>
            </div>
          )}

          <Separator />

          {/* Order Status */}
          {status && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </p>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center text-sm font-medium">
                  {status.icon}
                  {status.label}
                </div>

                <Badge
                  variant={
                    order.status === "paid"
                      ? "default"
                      : order.status === "canceled"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {status.value.replace("_", " ")}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderHeader({ order }: { order: Order }) {
  const isMobile = useMediaQuery("(max-width : 767px)");
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"} className="capitalize ">
            {isMobile ? (
              <EllipsisVertical />
            ) : (
              <>
                more actions
                <ChevronDown />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        onClick={() => navigate(`/orders/pdf/${parseFloat(order.id)}`)}
        size={"sm"}
        className="capitalize"
      >
        generate pdf
      </Button>

      <Button
        onClick={() => navigate(`/order/update/`)}
        size={"sm"}
        disabled
        className="capitalize"
      >
        update order{" "}
      </Button>
    </div>
  );
}

import { Banknote, Landmark, CreditCard } from "lucide-react";

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

import { cn } from "@/lib/utils";

export function OrderPaymentMode({ order }: { order: Order }) {
  const mode = PAYMENT_MODES.find((m) => m.value === order.paymentMode);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>

        <CardContent>
          {mode ? (
            <div
              className={cn(
                "flex items-center justify-between rounded-md border p-4",
                "bg-muted/30",
              )}
            >
              <div className="flex items-center text-sm font-medium">
                {mode.icon}
                {mode.label}
              </div>

              <Badge variant="secondary" className="capitalize">
                {mode.value}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No payment method specified
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// function OrderLayout() {
//   return (
//     <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-2  md:mx-18 border">
//       <div className="w-full col-span-2  border"> items </div>
//       <div className="w-full col-span-2  border"> payment </div>
//       <div className="w-full   border">customer</div>
//       <div className="w-full row-span-2  border">order type</div>
//
//       <div className="w-full col-span-2   border">timeline</div>
//     </div>
//   );
// }
