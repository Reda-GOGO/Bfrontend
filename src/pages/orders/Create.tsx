import Back from "@/components/own/Back";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import TypeForm from "@/components/own/orders/TypeForm.tsx";
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

export default function Create() {
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const navigate = useNavigate();
  return (
    <Back>
      <div className="flex w-full flex-col">
        <div className="@[768px]/main:grid @[768px]/main:grid-cols-3 w-full gap-4 xl:px-46">
          <div className="@[768px]/main:col-span-2 flex flex-col gap-2">
            <ProductForm />
            <PaymentForm />
          </div>
          <div className="@[768px]/main:col-span-1 max-lg:py-4 flex flex-col gap-2">
            <CustomerForm />
            <TypeForm />
            <ShippingForm />
            {/* <OrderPaymentModeCreate /> */}
          </div>
        </div>
        <div className="flex w-full p-4 justify-end">
          <Button className="w-[200px]">Add Order</Button>
        </div>
      </div>
    </Back>
  );
}
