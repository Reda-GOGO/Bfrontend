import Back from "@/components/own/Back";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import OrderConfiguration from "@/components/own/orders/OrderConfiguration.tsx";
import CustomerForm from "@/components/own/orders/CustomerForm.tsx";
import PaymentForm from "@/components/own/orders/PaymentForm.tsx";
import ProductForm from "@/components/own/orders/ProductForm.tsx";
import { useOrderContext } from "@/contexts/orderContext";
import { useAuth } from "@/contexts/userContext";
import { toast } from "sonner";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useNavigate } from "react-router";
import { OrderPaymentMode } from "./Order";
import OrderPaymentModeCreate from "@/components/own/orders/OrderPaymentModeCreate";
import ShippingForm from "@/components/own/orders/ShippingForm";
import useOrderItems from "@/application/orders/hooks/useOrderItems";
import AdvancedConfiguration from "@/components/own/orders/AdvancedConfiguration";
import { useMemo } from "react";

export default function Create() {
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const navigate = useNavigate();
  const orderItemHook = useOrderItems();
  const totalAmount = useMemo(() => {
    return orderItemHook.orderItems.reduce((s, i) => s + i.totalAmount, 0);
  }, [orderItemHook.orderItems]);
  console.log("orderItems : ", orderItemHook.orderItems)
  console.log("totalAmount : ", totalAmount)
  console.log("selected items : ", orderItemHook.selected)
  return (
    <Back>
      <div className="flex w-full flex-col">
        <div className="@[768px]/main:grid @[768px]/main:grid-cols-3 w-full gap-4 xl:px-46">
          <div className="@[768px]/main:col-span-2 flex flex-col gap-2">
            <ProductForm hook={orderItemHook} />
            <AdvancedConfiguration />
            <PaymentForm totalAmount={totalAmount} />
          </div>
          <div className="@[768px]/main:col-span-1 max-lg:py-4 flex flex-col gap-2">
            <CustomerForm />
            <OrderConfiguration />
            {/* <ShippingForm /> */}
            {/* <OrderPaymentModeCreate /> */}
          </div>
        </div>
        <div className="flex w-full gap-4 py-4 sm:px-45 px-2 max-sm:flex-col justify-end max-sm:justify-center max-sm:items-center">
          <Button variant={"secondary"} className="w-[200px] border-2">Discard Changes</Button>
          <Button className="w-[200px]">Add Order</Button>
        </div>
      </div>
    </Back>
  );
}


