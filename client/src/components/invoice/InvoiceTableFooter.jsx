import { StyleSheet, Text, View } from '@react-pdf/renderer'
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
        fontSize: 12,
        fontStyle: 'bold',
    },
    description: {
        width: '70%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
    total: {
        width: '15%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
    gst: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });

const InvoiceTableFooter = ({Amount}) => {

  // const {loading,orderdetails} = useSelector((state)=>state.orders) 


  // console.log("orderdetailsorderdetails",orderdetails)

    // const total = items.map(item => item.qty * item.rate)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
  return (
    <>
    <View style={styles.row}>
            <Text style={styles.description}>TOTAL</Text>
            <Text style={styles.total}>{ Number.parseFloat(Amount).toFixed(2)}</Text>
            <Text style={styles.gst}>{ Number.parseFloat(Amount).toFixed(2)}</Text>
        </View>
    
    </>
  )
}

export default InvoiceTableFooter