import type { Order } from "@/types";
import { useState } from "react";

type orderConfigType = Pick<Order, "type" | "status" | "paymentRef" | "paymentMode" | "partiallyPaidIn">;

const initialOrderConfig: orderConfigType = {
  type: "Facture",
  status: "Pending",
  paymentRef: "",
  paymentMode: "Espèce",
  partiallyPaidIn: null,
};


export default function useOrderConfig() {
  const [orderConfig, setOrderConfig] = useState<orderConfigType>(initialOrderConfig);

  return { orderConfig, setOrderConfig };

} 
