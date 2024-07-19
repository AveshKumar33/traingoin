import React from "react";
import { axiosInstance } from "../../../config";
import Preloader from "../../../components/preloader/Preloader";
import { useSelector } from "react-redux";

const RazorpayCheckout = ({
  Amount,
  orderid,
  paymentindex,
  setlocalpaymentstatus,
  setinstallmentIndex,
}) => {
  // console.log("orderrrrid",orderid)
  const { loading } = useSelector((state) => state.auth);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  // console.log("razorpay",userdetails)

  //RazoryPay Script
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const razorpaycheckout = async () => {
    alert("clicked");
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const { data } = await axiosInstance.put(
        `/api/order/installmentpayment/${orderid}`,
        {
          Amount: Amount,
        }
      );

      const { amount, id: order_id, currency } = data.data;
      // const { _id } = data.orderdata;

      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Railingo",
        description: "Pay",
        // image: { logo },
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          // alert("1 ")

          console.log("orderid", orderid);

          const res = await axiosInstance.get(`/api/order/${orderid}`);

          // alert("2")

          console.log("res", res);

          const result = res.data.data.orderItems;

          console.log("resulue", result);

          let neworderItem = result.map((p) => {
            if (p.sellingType === "Installment") {
              const updatedInstallment = p.Installment.map((innerobj, i) => {
                if (i === paymentindex) {
                  return {
                    ...innerobj,
                    paymentstatus: "Success",
                  };
                }
                return innerobj;
              });

              return { ...p, Installment: updatedInstallment };
            }
            return p;
          });

          // alert("6")
          // alert("neworderItem",neworderItem)

          await axiosInstance.put(`/api/order/${orderid}`, {
            // paymentStatus: "Successfull",
            orderItems: neworderItem,
          });

          // alert("7")

          setlocalpaymentstatus(true);
          setinstallmentIndex(paymentindex);

          alert("Payment Successfull");
        },
        // prefill: {
        //   name: "mm",
        //   email: "mihir@digisidekick.com",
        //   contact: 9110193437,
        // },
        notes: {
          address: "",
        },
        theme: {
          color: "#61dafb",
        },
      };

      // console.log("options");

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <button className="btn" onClick={razorpaycheckout}>
        <i className="fa fa-credit-card"></i>
      </button>

      {/* <button type="button" onClick={razorpaycheckout}>Pay Now</button> */}
    </>
  );
};

export default RazorpayCheckout;
