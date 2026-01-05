import type { Order, OrderItem } from "@/types";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Styles
const commonColumnStyle = {
  borderWidth: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2px",
};

const coloredColumnStyle = {
  ...commonColumnStyle,
  backgroundColor: "#7bd3ea",
};

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  customerInfo: {
    container: {
      display: "flex",
      alignItems: "flex-end",
      gap: "4px",
    },
    name: {
      fontSize: 18,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    number: {
      fontSize: 9,
    },
  },
  invoiceData: {
    container: {
      width: "300px",
      height: "auto",
      paddingBottom: "14px",
    },
    firstRow: {
      display: "flex",
      flexDirection: "row",
    },
    secondRow: {
      display: "flex",
      flexDirection: "row",
    },
    // Regular columns
    firstCol: {
      ...commonColumnStyle,
      width: "25%",
      borderTop: "none",
    },
    secondCol: {
      ...commonColumnStyle,
      width: "30%",
      borderLeft: "none",
      borderTop: "none",
    },
    thirdCol: {
      ...commonColumnStyle,
      width: "45%",
      borderLeft: "none",
      borderTop: "none",
    },
    // Colored columns
    coloredfirstCol: {
      ...coloredColumnStyle,
      width: "25%",
    },
    coloredsecondCol: {
      ...coloredColumnStyle,
      width: "30%",
      borderLeft: "none",
    },
    coloredthirdCol: {
      ...coloredColumnStyle,
      width: "45%",
      borderLeft: "none",
    },
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#bff0fd",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bff0fd",
    padding: 8,
  },
  tableColHeader: {
    flex: 1,
    fontWeight: "bold",
  },
  tableCol: {
    flex: 1,
  },
  total: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});
export const InvoiceImage = ({ logoUrl }) => (
  <View style={styles.header}>
    <Image style={styles.logo} src={logoUrl} />
  </View>
);
export const InvoiceCustomer = ({ order }: { order: Order }) => (
  <View style={styles.customerInfo.container}>
    <Text style={styles.customerInfo.name}>{order.customer.name}</Text>
    <Text style={styles.customerInfo.number}>ICE : {order.customer?.ice}</Text>
  </View>
);
export const InvoiceCustomerContainer = ({ order }: { order: Order }) => (
  <>
    <Text style={styles.title}>Devis</Text>
    <View style={styles.invoiceData.container}>
      <View style={styles.invoiceData.firstRow}>
        <View style={styles.invoiceData.coloredfirstCol}>
          <Text style={{ fontSize: 9 }}>Numero</Text>
        </View>
        <View style={styles.invoiceData.coloredsecondCol}>
          <Text style={{ fontSize: 9 }}>Date</Text>
        </View>
        <View style={styles.invoiceData.coloredthirdCol}>
          <Text style={{ fontSize: 9 }}>Mode paiement</Text>
        </View>
      </View>
      <View style={styles.invoiceData.secondRow}>
        <View style={styles.invoiceData.firstCol}>
          <Text style={{ fontSize: 9 }}>Devis {order.id}</Text>
        </View>
        <View style={styles.invoiceData.secondCol}>
          <Text style={{ fontSize: 9 }}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.invoiceData.thirdCol}>
          <Text style={{ fontSize: 9 }}>{order.paymentMode}</Text>
        </View>
      </View>
    </View>
  </>
);
const baseHeaderStyle = {
  border: "1px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px",
  backgroundColor: "#7bd3ea",
};

export const InvoiceHeaderColumn = ({ title, style }) => (
  <View style={{ ...baseHeaderStyle, ...style }}>
    <Text>{title}</Text>
  </View>
);

export const InvoiceTableHeader = () => (
  <View style={{ display: "flex", flexDirection: "row" }}>
    <InvoiceHeaderColumn title="Qté" style={{ width: "10%" }} />
    <InvoiceHeaderColumn
      title="Désignation"
      style={{ width: "50%", borderLeft: "none" }}
    />
    <InvoiceHeaderColumn
      title="Unité"
      style={{ width: "10%", borderLeft: "none" }}
    />
    <InvoiceHeaderColumn
      title="PU HT"
      style={{ width: "15%", borderLeft: "none" }}
    />
    <InvoiceHeaderColumn
      title="PT HT"
      style={{ width: "15%", borderLeft: "none" }}
    />
  </View>
);

const baseColumnStyle = {
  border: "1px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  borderLeft: "none",
  borderTop: "none",
  padding: "2px",
};

export const InvoiceColumn = ({ order, style, dataKey }: { order: Order }) => (
  <View style={{ ...baseColumnStyle, ...style }}>
    {order.items.map((item, index) => (
      <Text key={index}>{item[dataKey]}</Text>
    ))}
  </View>
);

export const InvoiceTableBody = ({ order }: { order: Order }) => {
  return (
    <View style={{ width: "100%" }}>
      <InvoiceTableHeader />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          height: "45vh",
        }}
      >
        <InvoiceColumn
          order={order}
          dataKey="quantity"
          style={{ width: "10%", borderLeft: "1px" }}
        />

        <InvoiceColumn order={order} dataKey="name" style={{ width: "50%" }} />

        <InvoiceColumn order={order} dataKey="unit" style={{ width: "10%" }} />

        <InvoiceColumn
          order={order}
          dataKey="unitPrice"
          style={{ width: "15%" }}
        />

        <View
          style={{
            ...baseColumnStyle,
            width: "15%",
            position: "relative",
          }}
        >
          {order.items.map((item, index) => (
            <Text key={index}>{item.totalAmount}</Text>
          ))}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "black",
              position: "absolute",
              width: "100%",
              bottom: "1%",
              left: 0,
            }}
          >
            {<Text style={{ textAlign: "center" }}>{order.totalAmount}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};
export const InvoiceTableFooter = () => (
  <View
    style={{
      display: "flex",
      width: "100vw",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: "1%",
    }}
  >
    <Text
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 6,
      }}
    >
      {" "}
      STE AGABEA13 SARL AU / ICE : 003137928000012 - IF : 53243983 -RC : 53439
      -TP : 48704868{" "}
    </Text>
    <Text
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 6,
      }}
    >
      Adresse : HAY ASSAKA BLOC B N° 225 TIKIOUINE AGADIR /Email :
      agabea13@gmail.com - Tél : 06.66.43.34.76
    </Text>
  </View>
);

const sharedStyle = {
  border: "1px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const containerStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  paddingTop: "8px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
};

const leftColumnStyle = {
  width: "25%",
  backgroundColor: "#7bd3ea",
};

const rightColumnStyle = {
  width: "15%",
};

export const InvoiceTotalAmount = ({ order }: { order: Order }) => {
  return (
    <View style={containerStyle}>
      <View style={[columnStyle, leftColumnStyle]}>
        <View style={[sharedStyle, { borderBottom: "none" }]}>
          <Text>Total HT</Text>
        </View>
        <View style={[sharedStyle, { borderBottom: "none" }]}>
          <Text>Montant TVA 20%</Text>
        </View>
        <View style={sharedStyle}>
          <Text>Total TTC</Text>
        </View>
      </View>

      <View style={[columnStyle, rightColumnStyle]}>
        <View
          style={[sharedStyle, { borderBottom: "none", borderLeft: "none" }]}
        >
          <Text>{order.totalAmount}</Text>
        </View>
        <View
          style={[sharedStyle, { borderBottom: "none", borderLeft: "none" }]}
        >
          <Text>{parseFloat(order.totalAmount * order.tax).toFixed(2)}</Text>
        </View>
        <View style={[sharedStyle, { borderLeft: "none" }]}>
          <Text>{order.totalAmountWithTax}</Text>
        </View>
      </View>
    </View>
  );
};

function InvoiceTotalAmountString({ order }: { order: Order }) {
  return (
    <View
      style={{
        display: "flex",
        gap: 4,
        flexDirection: "column",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
        }}
      >
        Arrétée la présente facture à la somme de :
      </Text>
      <Text>{order.totalAmountString}</Text>
    </View>
  );
}

export const EstimatePDF = ({ order, logoUrl }: { order: Order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceImage logoUrl={logoUrl} />
      <InvoiceCustomer order={order} />
      <InvoiceCustomerContainer order={order} />
      <InvoiceTableBody order={order} />
      <InvoiceTotalAmount order={order} />
      <InvoiceTotalAmountString order={order} />
      <InvoiceTableFooter />
    </Page>
  </Document>
);
