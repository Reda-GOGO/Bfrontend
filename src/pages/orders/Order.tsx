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
  CircleSlash,
  ClipboardList,
  DollarSign,
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
import { useParams } from "react-router";
import Back from "@/components/own/Back";

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
        <Card className="w-full max-w-5xl mx-auto p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              Order #{order.id}
              <Badge variant={"outline"}>
                <div className="flex items-center gap-1">
                  {statusMeta.icon}
                  {statusMeta.label}
                </div>
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Summary Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order Type</p>
                <div className="flex items-center gap-2 text-base">
                  {ORDER_TYPE_ICONS[order.type]}
                  <span className="capitalize font-medium">{order.type}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="text-base">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold text-primary">
                  MAD {order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total in Words</p>
                <p className="text-base italic">{order.totalAmountString}</p>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-base">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ICE</p>
                  <p className="text-base">{order.customer.ice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${order.customer.email}`}
                      className="text-sm underline"
                    >
                      {order.customer.email}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${order.customer.phone}`} className="text-sm">
                      {order.customer.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Items</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Media</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center gap-3">
                          {item.product.image ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${item.product.image
                                }`}
                              className="h-12 w-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-12 w-12 object-cover flex items-center justify-center bg-background rounded-md">
                              {/*   {" "} */}
                              <ImageOff />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.product.vendorName}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>MAD {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">
                          MAD {(item.quantity * item.unitPrice).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </Back>
    );
  }
}
