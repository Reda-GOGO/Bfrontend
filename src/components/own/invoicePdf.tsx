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

const styles = StyleSheet.create({
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
      fontSize: 14,
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
const InvoiceImage = ({ logoUrl }) => (
  <View style={styles.header}>
    <Image style={styles.logo} src={logoUrl} />
  </View>
);
const InvoiceCustomer = () => (
  <View style={styles.customerInfo.container}>
    <Text style={styles.customerInfo.name}>ARJDAL BADR</Text>
    <Text style={styles.customerInfo.number}>ICE : 003695576000050</Text>
  </View>
);
const InvoiceCustomerContainer = () => (
  <>
    <Text style={styles.title}>Facture</Text>
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
          <Text style={{ fontSize: 9 }}>FACTURE 188</Text>
        </View>
        <View style={styles.invoiceData.secondCol}>
          <Text style={{ fontSize: 9 }}>9/5/2025</Text>
        </View>
        <View style={styles.invoiceData.thirdCol}>
          <Text style={{ fontSize: 9 }}>Espèce</Text>
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

const InvoiceHeaderColumn = ({ title, style }) => (
  <View style={{ ...baseHeaderStyle, ...style }}>
    <Text>{title}</Text>
  </View>
);

const InvoiceTableHeader = () => (
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

const InvoiceColumn = ({ style, dataKey }) => (
  <View style={{ ...baseColumnStyle, ...style }}>
    {data.map((item, index) => (
      <Text key={index}>{item[dataKey]}</Text>
    ))}
  </View>
);

const InvoiceTableBody = () => {
  const totalSum = data.reduce((acc, item) => {
    return acc + parseFloat(item.price) * parseFloat(item.quantity);
  }, 0);

  // Format the total sum to two decimal places
  const formattedTotal = totalSum.toFixed(2);
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
          dataKey="quantity"
          style={{ width: "10%", borderLeft: "1px" }}
        />

        <InvoiceColumn dataKey="name" style={{ width: "50%" }} />

        <InvoiceColumn dataKey="unit" style={{ width: "10%" }} />

        <InvoiceColumn dataKey="price" style={{ width: "15%" }} />

        <View
          style={{
            ...baseColumnStyle,
            width: "15%",
            position: "relative",
          }}
        >
          {data.map((item, index) => (
            <Text key={index}>
              {parseFloat(
                parseFloat(item.price) * parseFloat(item.quantity),
              ).toFixed(2)}
            </Text>
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
            {<Text style={{ textAlign: "center" }}>{formattedTotal}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};
const InvoiceTableFooter = () => (
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
const data = [
  {
    quantity: 5,
    name: "Wooden Planks - Premium Grade",
    unit: "Meter",
    price: "15.75",
    price_tax: "18.92",
  },
  {
    quantity: 10,
    name: "Steel Reinforcement Bars",
    unit: "Bundle",
    price: "125.45",
    price_tax: "145.24",
  },
  {
    quantity: 8,
    name: "Concrete Cement - High Strength",
    unit: "Bag",
    price: "50.00",
    price_tax: "58.50",
  },
  {
    quantity: 3,
    name: "PVC Pipes - 3m Length",
    unit: "Piece",
    price: "30.50",
    price_tax: "35.85",
  },
  {
    quantity: 15,
    name: "Cement Blocks",
    unit: "Block",
    price: "8.30",
    price_tax: "9.66",
  },
  {
    quantity: 20,
    name: "Aluminum Sheets - Industrial Grade",
    unit: "Sheet",
    price: "45.20",
    price_tax: "53.02",
  },
  {
    quantity: 12,
    name: "Glass Panels - Tempered",
    unit: "Panel",
    price: "65.30",
    price_tax: "76.10",
  },
  {
    quantity: 25,
    name: "Sand - Fine Grain",
    unit: "Ton",
    price: "35.10",
    price_tax: "41.16",
  },
  {
    quantity: 50,
    name: "Bricks - Standard Red",
    unit: "Brick",
    price: "0.85",
    price_tax: "1.00",
  },
  {
    quantity: 18,
    name: "Tiles - Ceramic Floor",
    unit: "Box",
    price: "72.50",
    price_tax: "85.35",
  },
  {
    quantity: 22,
    name: "Insulation Roll - 50mm",
    unit: "Roll",
    price: "42.00",
    price_tax: "49.50",
  },
  {
    quantity: 30,
    name: "Electrical Cables - 2mm",
    unit: "Meter",
    price: "3.50",
    price_tax: "4.13",
  },
  {
    quantity: 7,
    name: "Air Conditioning Units - 1.5 Ton",
    unit: "Unit",
    price: "550.00",
    price_tax: "638.00",
  },
  {
    quantity: 16,
    name: "Paint - Wall White",
    unit: "Gallon",
    price: "22.75",
    price_tax: "26.20",
  },
  {
    quantity: 11,
    name: "Wooden Nails - 100g",
    unit: "Pack",
    price: "4.25",
    price_tax: "5.02",
  },
  {
    quantity: 14,
    name: "Lumber - Softwood",
    unit: "Piece",
    price: "20.50",
    price_tax: "24.15",
  },
  {
    quantity: 9,
    name: "Roofing Sheets - Zinc",
    unit: "Sheet",
    price: "35.90",
    price_tax: "42.32",
  },
  {
    quantity: 6,
    name: "Electric Switches - 5A",
    unit: "Pack",
    price: "12.00",
    price_tax: "14.10",
  },
  {
    quantity: 13,
    name: "Concrete Nails - 200g",
    unit: "Pack",
    price: "5.80",
    price_tax: "6.80",
  },
];

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

const InvoiceTotalAmount = () => {
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
          <Text>6666.67</Text>
        </View>
        <View
          style={[sharedStyle, { borderBottom: "none", borderLeft: "none" }]}
        >
          <Text>22222.33</Text>
        </View>
        <View style={[sharedStyle, { borderLeft: "none" }]}>
          <Text>800000000.50</Text>
        </View>
      </View>
    </View>
  );
};
export const InvoicePDF = ({ products, total, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceImage logoUrl={logoUrl} />
      <InvoiceCustomer />
      <InvoiceCustomerContainer />
      <InvoiceTableBody />
      <InvoiceTotalAmount />
      <InvoiceTableFooter />
    </Page>
  </Document>
);
