import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  ArrowDownUp,
  BadgeCheck,
  CircleSlash,
  ClipboardList,
  DollarSign,
  FileSignature,
  FileText,
  Hourglass,
  Search,
  Truck,
  User,
} from "lucide-react";
import OrderInfoCard from "@/components/own/orders/OrderInfoCard";

// Order type definitions with icon + label
const ORDER_TYPES = [
  {
    label: "Invoice",
    value: "invoice",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
  },
  {
    label: "Purchase Order",
    value: "purchase",
    icon: <ClipboardList className="w-4 h-4 text-indigo-500" />,
  },
  {
    label: "Delivery Order",
    value: "delivery",
    icon: <Truck className="w-4 h-4 text-green-500" />,
  },
  {
    label: "Estimate",
    value: "estimate",
    icon: <FileSignature className="w-4 h-4 text-yellow-600" />,
  },
];

// Status definitions with icon + label + color class
const STATUSES = [
  {
    label: "Pending",
    value: "pending",
    icon: <Hourglass className="w-4 h-4 text-yellow-500" />,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  {
    label: "Partially Paid",
    value: "partially_paid",
    icon: <DollarSign className="w-4 h-4 text-blue-500" />,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    label: "Paid",
    value: "paid",
    icon: <BadgeCheck className="w-4 h-4 text-green-600" />,
    color: "text-green-600 bg-green-50 border-green-200",
  },
  {
    label: "Canceled",
    value: "canceled",
    icon: <CircleSlash className="w-4 h-4 text-red-600" />,
    color: "text-red-600 bg-red-50 border-red-200",
  },
];

interface Customer {
  name: string;
  ice: string;
}

interface OrderItem {
  id: string | number;
  status: string;
  type: string;
  totalAmount: number;
  customer: Customer;
  createdAt: Date;
}

interface OrdersResponse {
  orders: OrderItem[];
}

export default function OrderPage() {
  const navigate = useNavigate();

  const [ordersResponse, setOrdersResponse] = useState<OrdersResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = (await res.json()) as OrdersResponse;
        setOrdersResponse(data);
      } catch (err: any) {
        console.error("Failed fetching orders:", err);
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/orders/create");
  };

  // Filter orders based on search
  const filteredOrders = ordersResponse?.orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.id.toString().includes(term) ||
      o.status.toLowerCase().includes(term) ||
      o.type.toLowerCase().includes(term) ||
      o.customer.name.toLowerCase().includes(term) ||
      o.customer.ice.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col w-full h-full py-6  space-y-6">
      {/* order info section  */}
      {/* <OrderInfoCard /> */}
      {/* --- Top Bar: Search + Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search orders by ID, customer or ICE..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            onClick={handleCreate}
            size="sm"
            className="flex items-center gap-1"
          >
            <FileSignature className="w-4 h-4" />
            Create Order
          </Button>
          <Button size="sm" variant="outline">
            More Actions
          </Button>
        </div>
      </div>

      {/* --- Table / States */}
      <div className="w-full overflow-x-auto border rounded-lg">
        {isLoading ? (
          <div className="w-full flex justify-center py-16">
            <span className="text-muted-foreground">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="w-full flex justify-center py-16 text-red-500">
            <span>Error loading orders: {error}</span>
          </div>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <div className="w-full flex justify-center py-16 text-muted-foreground">
            <span>No orders found.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow className="text-sm text-muted-foreground">
                <TableHead>
                  <Checkbox />
                </TableHead>
                <TableHead>
                  <div className="flex group h-full w-full items-center gap-2">
                    <span>Order ID</span>
                    <ArrowDownUp className="w-4 h-4 group-hover:visible invisible" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Creation Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, idx) => {
                const statusDef = STATUSES.find(
                  (s) => s.value === order.status,
                );
                const typeDef = ORDER_TYPES.find((t) => t.value === order.type);

                return (
                  <TableRow
                    onClick={() => navigate(`/orders/${order.id}`)}
                    key={idx}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      #order {order.id}
                    </TableCell>
                    <TableCell>
                      {statusDef ? (
                        <Badge
                          variant={"outline"}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-muted-foreground `}
                        >
                          {statusDef.icon}
                          {statusDef.label}
                        </Badge>
                      ) : (
                        <span className="capitalize">{order.status}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {typeDef ? (
                        <Badge
                          variant={"outline"}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded  text-muted-foreground "
                        >
                          {typeDef.icon}
                          {typeDef.label}
                        </Badge>
                      ) : (
                        <span className="capitalize">{order.type}</span>
                      )}
                    </TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)} MAD</TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            {order.customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ICE: {order.customer.ice}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
