import React from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  View,
  Text,
} from "@react-pdf/renderer";
import InvoiceTableRow from "./InvoiceTableRow";
import InvoiceTableHeader from "./InvoiceTableHeader";
import InvoiceTableFooter from "./InvoiceTableFooter";

const Invoice = ({ order, orderItem }) => {
 
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <Image
            style={styles.logo}
            src="http://railingonew.rankarts.in/assets/RALINGOBlack-432bd945.png"
          />
          {/* <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>Invoice</Text>
          </View> */}

          {/* Invoice or Order Number */}

          <View style={styles.invoiceNoContainer}>
            <Text style={styles.label}>Order No:</Text>
            <Text style={styles.invoiceDate}>{order.OrderID}</Text>
          </View>
          <View style={styles.invoiceDateContainer}>
            <Text >Date:  </Text>
            <Text>{order?.createdAt?.slice(0,10).split("-").reverse().join("-")}</Text>
          </View>
          
          <View style={styles.headerContainer}>
            <Text style={styles.billTo}>Bill To:</Text>
            <Text>{order?.Name}</Text>
            <Text>{order?.Address}</Text>
            <Text>{order?.Phone}</Text>
            <Text>{order?.Email}</Text>
          </View>

          <InvoiceTableHeader />

          {orderItem && (
            <>
              <InvoiceTableRow orderItem={orderItem} />
              <InvoiceTableFooter Amount={order.Amount} />
            </>
          )}

          
        </Page>
      </Document>
    </>
  );
};

export default Invoice;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
  titleContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  reportTitle: {
    color: "#61dafb",
    letterSpacing: 4,
    fontSize: 15,
    textAlign: "center",
    fontWeight:"900",
    textTransform: "uppercase",
    
  },
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 36,
    justifyContent: "flex-end",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },

  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: "Helvetica-Oblique",
  },
});
