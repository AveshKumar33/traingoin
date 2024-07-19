import { useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import TopHeader from "../../../components/topheader/TopHeader";
import ReactToPrint from "react-to-print";
import { REACT_APP_URL } from "../../../config";

import {
  fetchOrdersDetails,
  updateOrder,
} from "../../../redux/slices/orderSlice";
import Preloader from "../../../components/preloader/Preloader";
import { DynamicAttribute } from "../../../components/cartSidebar/CartSidebar";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import Invoice from "../../../components/invoice/Invoice";
import Modal from "../../../components/modal/Modal";
// import NewInvoice from "../../../components/newinvoice/NewInvoice";
// import ProductCustomizedProduct from "../../client/productdetails/customizedproduct/ProductCustomizedProduct";
import { getPercentage } from "../../../utils/usefullFunction";

const EditOrder = () => {
  const { loading, orderdetails } = useSelector((state) => state.orders);
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [orderItem, setorderItem] = useState([]);
  const [coupon, setCoupon] = useState({});
  const componentRef = useRef(null);

  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  const [formdata, setformdata] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Amount: "",
    PinCode: "",
    City: "",
    State: "",
    Address: "",
    paymentStatus: "",
    UserDetails: "",
    Coupon: "",
  });

  const {
    Name,
    Phone,
    Email,
    Amount,
    PinCode,
    City,
    State,
    Address,
    OrderID,
    DiscountAmount,
  } = formdata;

  useEffect(() => {
    dispatch(fetchOrdersDetails(id));
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled" && orderdetails) {
      const { orderItems, Coupon, ...orderdetail } = orderdetails;
      setformdata(orderdetail);
      setorderItem(orderItems);
      setCoupon(Coupon);
    }
  }, [loading]);

  // const onChange = (e) => {
  //   setformdata({
  //     ...formdata,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const updateddata = {
  //     id,
  //     orderdata: {
  //       // CouponName,
  //       // CouponAmount,
  //     },
  //   };

  //   dispatch(updateOrder(updateddata));

  //   navigate("/admin/order");
  // };

  // Table Addition

  let calculategstprice = orderItem?.reduce((sum, item, index) => {
    if (index === 0) {
      return sum + Number(calculateGST(item.price - DiscountAmount, item.gst));
    } else {
      return sum + Number(calculateGST(item.price, item.gst));
    }
  }, 0);
  let gstamount = orderItem?.reduce((sum, item, index) => {
    if (index === 0) {
      return (
        sum +
        Number(item.price - DiscountAmount) -
        Number(calculateGST(item.price - DiscountAmount, item.gst))
      );
    } else {
      return (
        sum + Number(item.price) - Number(calculateGST(item.price, item.gst))
      );
    }
  }, 0);
  let totalamount = orderItem?.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <Modal handleClose={handleClose} show={show} width="90%" height="500px">
        <div
          className="px-5"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "50px",
          }}
        >
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-primary">Print Invoice</button>
            )}
            content={() => componentRef.current}
          />
        </div>

        <div className="p-5" ref={componentRef}>
          <div className="row my-3 justify-content-center">
            <img
              loading="lazy"
              src="http://railingonew.rankarts.in/assets/RALINGOBlack-432bd945.png"
              alt=""
              className="img-fluid"
              style={{ width: "200px", height: "auto" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h6>Bill To :</h6>
              <ShippingAddress
                Name={Name}
                Phone={Phone}
                Email={Email}
                City={City}
                State={State}
                PinCode={PinCode}
                Address={Address}
              />
            </div>

            <div>
              <p>Order No. # {OrderID}</p>
              <p>
                Date :{" "}
                {orderdetails?.createdAt
                  ?.slice(0, 10)
                  .split("-")
                  .reverse()
                  .join("-")}
              </p>
              {/* <p>
                {Address},{City},{State} - {PinCode}
              </p> */}
            </div>
          </div>

          <hr />

          <OrderItems
            orderItem={orderItem}
            coupon={coupon}
            calculategstprice={calculategstprice}
            gstamount={gstamount}
            totalamount={totalamount}
            DiscountAmount={DiscountAmount}
          />
        </div>

        {/* <NewInvoice/> */}
      </Modal>

      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title d-flex ">
                        <h3 className="m-0">Order</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => setshow(true)}
                      >
                        Preview Invoice
                      </button>
                    </div>

                    {/* Pdf Creation */}
                    {/* <PDFDownloadLink
                      document={
                        <Invoice order={orderdetails} orderItem={orderItem} />
                      }
                      fileName="orderdetails.pdf"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: "10px 0px",
                      }}
                    >
                      
                      {
                        ({ blob, url, loading, error }) => (
                          <>
                            <button className="btn btn-primary">
                              {loading
                                ? "Loading Invoice..."
                                : "Download Invoice !"}
                            </button>
                          </>
                        )
                       
                      }
                      
                    </PDFDownloadLink> */}
                    <div className="card-body">
                      <OrderItems
                        orderItem={orderItem}
                        coupon={coupon}
                        calculategstprice={calculategstprice}
                        gstamount={gstamount}
                        totalamount={Amount}
                        DiscountAmount={DiscountAmount}
                      />
                      <ShippingAddress
                        Name={Name}
                        Phone={Phone}
                        Email={Email}
                        City={City}
                        State={State}
                        PinCode={PinCode}
                        Address={Address}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

const Items = ({ item, DiscountAmount, index }) => {
  const totalAmount = item.price / item.quantity;
  const GstAmount = getPercentage(totalAmount, item.gst ?? 0);
  let Total_Without_GST = totalAmount - GstAmount;
  console.log(Total_Without_GST, "Total_Without_GST");
  let Total_Without_Installlation = Total_Without_GST - item.InstallmentAmount;
  console.log(Total_Without_Installlation, "Total_Without_Installlation");
  const wastage = getPercentage(Total_Without_Installlation, item.Wastage ?? 0);
  let OnlyProductPrice = Total_Without_Installlation - wastage;

  return (
    <>
      <div className="row">
        <div className="col-md-1">
          {/*  
          {item.customizedProductImage &&
          Object.keys(item.customizedProductImage).length > 0 ? (
            <ProductCustomizedProduct
              varientproductdetails={
                item.customizedProductImage.varientproductdetails
              }
              attribute={item.customizedProductImage.attribute}
              attributePosition={item.customizedProductImage.attributePosition}
              height="10vh"
              width="10vh"
              name="cartImage"
            />
          ) : (
            <>
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/product/${item.img}`}
                style={{ height: "10vh" }}
                alt="prev"
              />
            </>
          )}

          */}

          {/* <img
            src={`${REACT_APP_URL}/images/product/${item.img}`}
            alt=""
            style={{ width: "100%" }}
          /> */}
        </div>
        <div className="col-md-2">
          <span className="bg-primary p-1 rounded" style={{ fontSize: "12px" }}>
            {item?.sellingType}
          </span>
          <br />
          <br />

          <DynamicAttribute item={item} />

          <br></br>
          {item.sellingType === "Installment" &&
            item.Installment.map((p) => (
              <>
                <div>
                  <span className="my-5">
                    {p.Name} - ₹ {p.Amount} &nbsp;{" "}
                    {p.paymentstatus ? (
                      <>
                        <i
                          className="fa fa-check"
                          style={{ color: "green" }}
                        ></i>
                      </>
                    ) : (
                      <>
                        <span>
                          <button className="btn">
                            <i className="fa fa-credit-card"></i>
                          </button>
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </>
            ))}
        </div>
        <div className="col-md-2">
          {item.name} <br />
          <p>Rate : ₹ {item.price / item.quantity} </p>
          <p>Quantity : {item.quantity} </p>
        </div>

        <div className="col-md-2" style={{ textAlign: "center" }}>
          {/* {calculateGST(item.price,item.gst)}({item.gst}%) */}
          <p>Price : ₹{OnlyProductPrice} </p>
          <p>
            Wastage : {item.Wastage}% of +₹{wastage}{" "}
          </p>
          <p>Installation : +₹{item.InstallmentAmount} </p>
          <p>
            GST : {item.gst}% of +₹{GstAmount}
          </p>
          <p>Total Price : ₹{item.price} </p>
        </div>
      </div>
    </>
  );
};

const CouponSection = ({ Coupon, DiscountAmount }) => {
  return (
    <>
      <div className="row mt-2">
        <hr />

        <div className="col-md-3">
          <h6>
            <b>Coupon Discount</b>
          </h6>
        </div>

        <div className="col-md-3">{Coupon.CouponName}</div>

        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        <div className="col-md-2">₹ {DiscountAmount}</div>
      </div>
    </>
  );
};

const OrderItems = ({
  orderItem,
  coupon,
  gstamount,
  totalamount,
  calculategstprice,
  DiscountAmount,
}) => {
  console.log(orderItem, "orderItemorderItemorderItem");
  return (
    <>
      <div className="row">
        <div className="col-md-1">Product</div>
        <div className="col-md-2">Order Type</div>
        <div className="col-md-2">Product Details</div>
        {/* <div className="col-md-1">Quantity</div> */}
        {/* <div className="col-md-1">GST %</div> */}
        {/* <div className="col-md-1">Rate</div> */}
        <div className="col-md-2">Cost Sheet</div>
        {/* <div className="col-md-2">GST Amount</div> */}
        {/* <div className="col-md-2">Amount</div> */}
      </div>
      <hr />

      {orderItem &&
        orderItem.map((p, i) => (
          <>
            <Items
              key={p.id}
              item={p}
              DiscountAmount={DiscountAmount}
              index={i}
            />
            {i !== orderItem.length - 1 && <hr />}
          </>
        ))}

      {/* Coupon Code Applied Section */}

      {coupon && Object.keys(coupon)?.length !== 0 && (
        <CouponSection Coupon={coupon} DiscountAmount={DiscountAmount} />
      )}
      {/* GST Calculation Section  */}
      <hr />

      <div className="row">
        <div className="col-md-1">Total</div>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
        {/* <div className="col-md-1"></div> */}
        {/* <div className="col-md-1"></div>
        <div className="col-md-1"></div> */}
        {/* <div className="col-md-2">₹ {calculategstprice?.toFixed(2)}</div>
        <div className="col-md-2">₹ {gstamount?.toFixed(2)}</div> */}
        <div className="col-md-2">₹ {totalamount}</div>
      </div>
    </>
  );
};

const ShippingAddress = ({
  Name,
  Phone,
  Email,
  City,
  State,
  PinCode,
  Address,
}) => {
  return (
    <>
      {/* <div className="row">
        <h6>
          <b>Shipping Address</b>
        </h6> */}
      <hr />
      <p>
        {Name} - {Phone}
      </p>
      <p>{Email}</p>
      <p>
        {Address},{City},{State} - {PinCode}
      </p>
      {/* <div className="col-md-3"></div>
                        <div className="col-md-3"></div>
                        <div className="col-md-3"></div> */}

      {/* <PDFViewer width="1000" height="600">
                          <Invoice order={orderdetails} orderItem={orderItem} />
                        </PDFViewer>

                        <div className="col-md-3">₹ {Amount}</div> */}
      {/* </div> */}
    </>
  );
};

function calculateGST(price, rate) {
  const gstAmount = (price * 100) / (100 + rate);

  return gstAmount.toFixed(2);
}

export default EditOrder;
