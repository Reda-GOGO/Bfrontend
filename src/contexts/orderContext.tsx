import { createContext, useContext, useState } from "react";
import type { OrderItem, OrderType, ProductType } from "@/types/index.ts";

export enum OrderStatusEnum {
  PENDING = "pending",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  CANCELED = "canceled",
}

export enum OrderTypeEnum {
  INVOICE = "invoice",
  DELIVERY = "delivery",
  PURCHASE = "purchase",
  ESTIMATE = "estimate",
}

interface OrderContextType {
  customer: Pick<OrderType, "customerId" | null>;
  setCustomer: React.Dispatch<
    React.SetStateAction<Pick<OrderType, "customerId" | null>>
  >;
  type: string | undefined;
  setType: React.Dispatch<React.SetStateAction<string>>;
  status: string | undefined;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  totalAmount: number;
  setTotalAmount: React.Dispatch<React.SetStateAction<number>>;
  totalAmountString: string;
  setTotalAmountString: React.Dispatch<React.SetStateAction<string>>;
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  selectedProducts: ProductType[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

export const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] =
    useState<Pick<OrderType, "customerId" | null>>();
  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAmountString, setTotalAmountString] = useState<string>("");
  const [partiallyPaidIn, setPartiallyPaidIn] = useState(0);
  const [paymentMode, setPaymentMode] = useState("espece");

  const value: OrderContextType = {
    customer,
    setCustomer,
    type,
    setType,
    status,
    totalAmount,
    setTotalAmount,
    totalAmountString,
    setTotalAmountString,
    setStatus,
    orderItems,
    setOrderItems,
    selectedProducts,
    setSelectedProducts,
    partiallyPaidIn,
    setPartiallyPaidIn,
    paymentMode,
    setPaymentMode,
  };
  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
