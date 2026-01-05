import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import logoImage from "../assets/IMG-20241126-WA0000.jpg";
import { InvoicePDF } from "@/components/own/invoicePdf";
import type { Order } from "@/types";
import { useEffect, useState } from "react";
function Invoice() {
  const [order, setOrder] = useState();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/${parseInt(20)}`,
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
  const invoiceData = {
    logoUrl: logoImage, // Place your logo in the public folder or use a remote URL
    products: [
      { name: "Product A", quantity: 2, price: 50, unite: "piece" },
      { name: "Product B", quantity: 1, price: 30, unite: "paque" },
      { name: "Product C", quantity: 3, price: 20, unite: "boite" },
    ],
  };
  const total = invoiceData.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const document = <InvoicePDF order={order} logoUrl={invoiceData.logoUrl} />;
  return (
    <div style={{ padding: 20 }}>
      <h1>Invoice Preview</h1>
      <div
        style={{ height: "80vh", border: "1px solid #ccc", marginBottom: 20 }}
      >
        <PDFViewer width="100%" height="100%">
          {document}
        </PDFViewer>
      </div>
      <PDFDownloadLink document={document} fileName="invoice.pdf">
        {({ loading }) =>
          loading ? (
            "Preparing document..."
          ) : (
            <button>Download Invoice PDF</button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}
export default Invoice;
