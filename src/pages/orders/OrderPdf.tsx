import { InvoicePDF } from "@/components/own/invoicePdf";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import logoImage from "../../assets/IMG-20241126-WA0000.jpg";
import Back from "@/components/own/Back";

export default function OrderPdf() {
  const { id } = useParams();
  const [order, setOrder] = useState();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/${parseInt(id)}`,
        );
        if (!res.ok) {
          throw new Error("", res.status);
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error("", error);
      }
    };
    getOrder();
  }, []);

  const document = <InvoicePDF order={order} logoUrl={logoImage} />;
  return (
    <Back className="h-full">
      <div className="w-full min-h-full h-full ">
        <PDFViewer width="100%" height="100%">
          {document}
        </PDFViewer>
      </div>
    </Back>
  );
}
