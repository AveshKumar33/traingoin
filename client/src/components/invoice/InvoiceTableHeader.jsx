import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'


const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    invoicecontainer: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        // backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        // height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        // flexGrow: 1,
        marginTop:12
        
    },
    description: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    gstpercentage:{
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    texableamount: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1
    },
    gstamount:{
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1

    },
    amount: {
        width: '15%',
        // borderRightColor: borderColor,
        // borderRightWidth: 1
    },
  });

const InvoiceTableHeader = () => {
  return (
    <>
    <View style={styles.invoicecontainer}>
        <Text style={styles.description}>Item Description</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.gstpercentage}>GST %</Text>
        <Text style={styles.rate}> Rate</Text>
        <Text style={styles.texableamount}>Tex. Amount</Text>
        <Text style={styles.gstamount}>Gst Amount</Text>
        <Text style={styles.amount}>Amount</Text>
    </View>
    
    </>
  )
}

export default InvoiceTableHeader