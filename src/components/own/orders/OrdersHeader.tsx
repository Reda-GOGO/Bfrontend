import { TitleLayout } from "@/components/shared/title-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChevronDown, EllipsisVertical, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router";
import OrderInfoCard from "./OrderInfoCard";
export function OrdersHeader() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col ">
      <div className="flex w-full justify-between gap-2 py-2">
        <TitleLayout title="Orders" icon={<ShoppingCart />} />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="capitalize">
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
            onClick={() => navigate("/orders/create")}
            size={"sm"}
            className="capitalize"
          >
            create order{" "}
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Order Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Track customer purchases, fulfillment status, and transaction history.
        </p>
      </div>
      <OrderInfoCard />
    </div>
  );
}
