import { Text, View } from "@react-pdf/renderer";
import React from "react";

const tableRowsCount = 11;
const borderColor = '#90e5fc'

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
},
description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
},
qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
},
rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
},
amount: {
    width: '15%'
},
});

const InvoiceItemsTable = () => {
  return (
    <>
      <View style={styles.tableContainer}>
        {/* <InvoiceTableHeader /> */}

        {/* Invoice Table Header */}

        <View style={styles.container}>
          <Text style={styles.description}>Item Description</Text>
          <Text style={styles.qty}>Qty</Text>
          <Text style={styles.rate}>@</Text>
          <Text style={styles.amount}>Amount</Text>
        </View>

        <InvoiceTableRow items={invoice.items} />
        <InvoiceTableBlankSpace
          rowsCount={tableRowsCount - invoice.items.length}
        />
        <InvoiceTableFooter items={invoice.items} />
      </View>
    </>
  );
};

export default InvoiceItemsTable;
