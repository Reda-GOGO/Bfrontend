import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  FileText,
  ClipboardList,
  Truck,
  Wallet,
  Banknote,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

const orders = [
  {
    id: "INV-2024-001",
    type: "Invoice",
    customer: "Atlas Trading SARL",
    payment: "Cash",
    totalHT: 4200,
    itemsCount: 12,
    date: "Today",
  },
  {
    id: "PO-2024-014",
    type: "Purchase Order",
    customer: "Maroc Distribution",
    payment: "Bank Transfer",
    totalHT: 3150,
    itemsCount: 8,
    date: "Yesterday",
  },
  {
    id: "DN-2024-009",
    type: "Delivery Note",
    customer: "Alpha Logistics",
    payment: "Cheque",
    totalHT: 1980,
    itemsCount: 5,
    date: "2 days ago",
  },
  {
    id: "QT-2024-022",
    type: "Quotation",
    customer: "Techno Plus",
    payment: "Bank Transfer",
    totalHT: 5600,
    itemsCount: 15,
    date: "3 days ago",
  },
];

const typeConfig: Record<string, any> = {
  Invoice: { icon: Receipt, badge: "bg-emerald-500/10 text-emerald-600" },
  "Purchase Order": {
    icon: ClipboardList,
    badge: "bg-blue-500/10 text-blue-600",
  },
  "Delivery Note": { icon: Truck, badge: "bg-violet-500/10 text-violet-600" },
  Quotation: { icon: FileText, badge: "bg-amber-500/10 text-amber-600" },
};

const paymentIcons: Record<string, any> = {
  Cash: Wallet,
  "Bank Transfer": Banknote,
  Cheque: CreditCard,
};

export default function TopOrders() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Recent Orders
          </CardTitle>
          <button className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <CardDescription>Best orders in the selected period</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <ScrollArea className="h-[250px]">
          <div className="flex flex-col gap-1.5 p-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function OrderCard({ order }: { order: typeof orders[0] }) {
  const Icon = typeConfig[order.type].icon;
  const PaymentIcon = paymentIcons[order.payment];
  const tax = order.totalHT * 0.2;
  const total = order.totalHT + tax;

  return (
    <div className="group flex items-center gap-3 bg-card px-1 py-1.5 transition hover:bg-muted/40">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{order.customer}</span>
          <Badge
            className={`rounded-full px-2 py-0 text-[10px] ${typeConfig[order.type].badge
              }`}
          >
            {order.type}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{order.id}</span>
          <span className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            {order.itemsCount}
          </span>
          <span className="flex items-center gap-1">
            <PaymentIcon className="h-3 w-3" />
            {order.payment}
          </span>
        </div>
      </div>

      <div className="text-right leading-tight">
        <div className="text-[11px] text-muted-foreground">
          HT {order.totalHT.toLocaleString()}
        </div>
        <div className="text-[11px] text-muted-foreground">
          TVA {tax.toLocaleString()}
        </div>
        <div className="text-sm font-semibold">
          {total.toLocaleString()} MAD
        </div>
        <div className="text-[10px] text-muted-foreground">{order.date}</div>
      </div>
    </div>
  );
}
