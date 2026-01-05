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

export default function Create() {
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const navigate = useNavigate();
  const {
    orderItems,
    type,
    status,
    customer,
    totalAmount,
    totalAmountString,
    partiallyPaidIn,
    paymentMode,
  } = useOrderContext();
  const { currentUser } = useAuth();
  const handleSubmit = async () => {
    console.log("orderItems :", orderItems);
    console.log("type :", type);
    console.log("status :", status);
    console.log("customer :", customer);
    console.log("totalAmount :", totalAmount, typeof totalAmount);
    console.log("totalAmountString :", totalAmountString);
    console.log("currentUser : ", currentUser);
    console.log("partiallyPaidIn : ", partiallyPaidIn);
    console.log("payment mode : ", paymentMode);
    if (orderItems.length == 0) {
      return toast.message("failed creating order", {
        description: "missing order items ...",
        icon: <CircleX className="text-red-500" />,
      });
    }
    if (type === "" && status === "" && customer === undefined) {
      return toast("failed creating order", {
        icon: <CircleX className="text-red-500" />,
      });
    }
    const payload = {
      orderItems,
      type: type,
      status,
      totalAmount,
      totalAmountString,
      customerId: customer,
      createdBy: currentUser.id,
      partiallyPaidIn: partiallyPaidIn ? parseFloat(partiallyPaidIn) : 0,
      paymentMode: paymentMode ? paymentMode : "espèce",
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 201) {
        toast(" order created succesfully", {
          icon: <CircleCheckBig className="text-green-500" />,
        });
        navigate("/orders");
      } else {
        toast.message("Failed creating order", {
          description: "missing fields ..",
          icon: <CircleX className="text-red-500" />,
        });
      }
      console.log("saved order : ", data, res.status);
    } catch (error) {
      console.log("error adding order : ", error);

      toast("Failed creating order", {
        icon: <CircleX className="text-red-500" />,
      });
    }
  };
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
            <OrderPaymentModeCreate />
          </div>
        </div>
        <div className="flex w-full p-4 justify-end">
          <Button onClick={handleSubmit} className="w-[200px]">
            Add Order
          </Button>
        </div>
      </div>
    </Back>
  );
}
