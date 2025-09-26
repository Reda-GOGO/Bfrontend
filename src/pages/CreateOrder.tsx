import Back from "@/components/own/Back";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import TypeForm from "@/components/own/orders/TypeForm.tsx";
import CustomerForm from "@/components/own/orders/CustomerForm.tsx";
import PaymentForm from "@/components/own/orders/PaymentForm.tsx";
import ProductForm from "@/components/own/orders/ProductForm.tsx";
import { useOrderContext } from "@/contexts/orderContext";
import { useAuth } from "@/contexts/userContext";

export default function Create() {
  const isDesktop = useMediaQuery("(min-width : 768px)");

  const { orderItems, type, status, customer, totalAmount, totalAmountString } =
    useOrderContext();
  const { currentUser } = useAuth();
  const handleSubmit = async () => {
    console.log("orderItems :", orderItems);
    console.log("type :", type);
    console.log("status :", status);
    console.log("customer :", customer);
    console.log("totalAmount :", totalAmount, typeof totalAmount);
    console.log("totalAmountString :", totalAmountString);
    console.log("currentUser : ", currentUser);

    const payload = {
      orderItems,
      type: type,
      status,
      totalAmount,
      totalAmountString,
      customerId: customer,
      createdBy: currentUser.id,
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
      console.log("saved order : ", data);
    } catch (error) {
      console.log("error adding order : ", error);
    }
  };
  return (
    <Back>
      <div className="flex w-full flex-col">
        <div className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46">
          <div className="lg:col-span-2 flex flex-col gap-2">
            <ProductForm />
            <PaymentForm />
          </div>
          <div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
            <CustomerForm />
            <TypeForm />
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
