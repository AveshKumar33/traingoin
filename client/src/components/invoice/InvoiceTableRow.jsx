import { View,Text, StyleSheet } from '@react-pdf/renderer'
import React from 'react'
import { useSelector } from 'react-redux';




const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    description: {
        width: '45%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    gst:{
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,

    }
  });


const InvoiceTableRow = ({orderItem}) => {




    const rows = orderItem.map( item => 
        <View style={styles.row} key={item.name}>
            <Text style={styles.description}>{item.name}</Text>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Text style={styles.rate}> {item.price / item.quantity}</Text>
            <Text style={styles.amount}>{(item.price).toFixed(2)}</Text>
            <Text style={styles.gst}>{calculateGST(item.price,item.gst)}</Text>
        </View>
    )


  return (
    <>
    {rows}
    
    </>
  )
}

function calculateGST(price, rate) {
    const gstAmount = (price * rate) / 100;
    return gstAmount.toFixed(2);
  
  }


export default InvoiceTableRow