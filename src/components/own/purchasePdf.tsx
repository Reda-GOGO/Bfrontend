import {
  InvoiceCustomer,
  InvoiceCustomerContainer,
  InvoiceImage,
  InvoiceTableBody,
  InvoiceTableFooter,
  InvoiceTotalAmount,
} from "./invoicePdf.tsx";

import { Document, Page } from "@react-pdf/renderer";

export const PurchasePdf = ({ products, total, logoUrl }) => (
  <Document>
    <Page
      size="A4"
      style={{
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
      }}
    >
      <InvoiceImage logoUrl={logoUrl} />
      <InvoiceCustomer />
      <InvoiceCustomerContainer />
      <InvoiceTableBody />
      <InvoiceTotalAmount />
      <InvoiceTableFooter />
    </Page>
  </Document>
);
