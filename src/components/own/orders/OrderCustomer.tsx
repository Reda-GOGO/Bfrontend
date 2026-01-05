import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, IdCard } from "lucide-react";
import type { Order } from "@/types";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function OrderCustomer({ order }: { order: Order }) {
  const customer = order.customer;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Customer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top identity section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm font-semibold">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-base font-semibold leading-none">
              {customer.name}
            </p>
          </div>
        </div>

        <Separator />

        {/* Details grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={Phone} label="Phone" value={customer.phone} />
          <InfoRow icon={Mail} label="Email" value={customer.email} />
          <InfoRow icon={IdCard} label="ICE" value={customer.ice} />
          <InfoRow icon={MapPin} label="Address" value={customer.address} />
        </div>
      </CardContent>
    </Card>
  );
}
