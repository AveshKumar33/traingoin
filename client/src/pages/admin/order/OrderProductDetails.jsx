import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Preloader from "../../../components/preloader/Preloader";
import { fetchOrderProductById } from "../../../redux/slices/orderSlice";
import OrderProducts from "../../../components/order/OrderProducts";
import TopHeader from "../../../components/topheader/TopHeader";
import SideBar from "../../../components/sidebar/SideBar";

const OrderProductDetails = () => {
  // its order _id
  const { orderId } = useParams();

  const dispatch = useDispatch();

  const {
    loading,
    orderProducts,
    singleProducts,
    customizeProducts,
    singleDotProducts,
    customizeDotProducts,
    customizeComboProducts,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderProductById(orderId));
    }
  }, [dispatch, orderId]);

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
                        <h3 className="m-0">Order Products</h3>
                      </div>
                    </div>
                  </div>

                  {loading === "pending" ? (
                    <Preloader />
                  ) : (
                    <OrderProducts
                      orderProducts={
                        orderProducts && orderProducts?.length > 0
                          ? orderProducts[0]
                          : []
                      }
                      singleProducts={singleProducts}
                      customizeProducts={customizeProducts}
                      singleDotProducts={singleDotProducts}
                      customizeDotProducts={customizeDotProducts}
                      customizeComboProducts={customizeComboProducts}
                      isAdmin={true}
                    />
                  )}
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

export default OrderProductDetails;
