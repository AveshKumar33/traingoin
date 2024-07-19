import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchOrders } from "../../../redux/slices/orderSlice";

import Preloader from "../../../components/preloader/Preloader";
import TopHeader from "../../../components/topheader/TopHeader";
import SideBar from "../../../components/sidebar/SideBar";
import OrderList from "../../../components/order/OrderList";

const Order = () => {
  const dispatch = useDispatch();

  const { loading, orders } = useSelector((state) => state.orders);

  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled" && orders && orders?.length > 0) {
      setAllOrders(orders);
    }
  }, [loading, orders]);

  return (
    <>
      <SideBar />
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">order</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    {loading === "pending" ? (
                      <Preloader />
                    ) : allOrders && allOrders?.length > 0 ? (
                      <OrderList allOrders={allOrders} isAdmin={true} />
                    ) : (
                      <p style={{ textAlign: "center" }}>No Orders To Show </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer_iner text-center">
                  <p>
                    Designed & Developed By{" "}
                    <a href="http://marwariplus.com/">InnovateX Technology</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Order;
