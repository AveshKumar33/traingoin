import SideBar from "../../../components/sidebar/SideBar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrderStatus,
  fetchOrderStatusDetails,
  updateOrderStatusDetails,
} from "../../../redux/slices/orderStatusSlice";

import { useNavigate, useParams } from "react-router-dom";

const CreateOrderStatus = () => {
  const { id } = useParams();

  const { loading, orderStatusDetails } = useSelector(
    (state) => state.orderStatus
  );

  const [name, setName] = useState();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== "add") {
      dispatch(fetchOrderStatusDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && orderStatusDetails && id !== "add") {
      setName(orderStatusDetails?.name);
    }
  }, [loading, orderStatusDetails, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id === "add") {
      dispatch(createOrderStatus({ name }));
    } else {
      dispatch(updateOrderStatusDetails({ id, orderStatusData: { name } }));
    }

    if (loading === "fulfilled") {
      navigate("/admin/order-status");
    }
  };

  return (
    <>
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
                      <div className="main-title">
                        <h3 className="m-0">Order Status</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label
                              className="form-label"
                              htmlFor="Order Status"
                            >
                              Name (Order Status)
                            </label>
                            <input
                              type="Order Status"
                              className="form-control"
                              id="Order Status"
                              value={name || ""}
                              onChange={(e) => setName(e.target.value)}
                              required
                              autoFocus
                            />
                          </div>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                      </form>
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

export default CreateOrderStatus;
