import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { deleteCoupon, fetchCoupons } from "../../../redux/slices/couponSlice";
import Preloader from "../../../components/preloader/Preloader";
import Header from "../../../components/header/Header";

const Coupon = () => {
  const { loading, coupons } = useSelector((state) => state.coupons);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <div>
        {/* <h1>Loading...</h1> */}
        <Preloader />
      </div>
    );
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <>
      {/* <SideBar /> */}

      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        {/* <TopHeader /> */}
        <Header />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Coupon</h3>
                      </div>
                      <Link
                        to="/admin/add-coupon"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Coupon
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Coupon Type</th>
                            <th scope="col">Coupon Name</th>
                            <th scope="col">Coupon Amount</th>
                            <th scope="col">Coupon Percentage</th>
                            <th scope="col">Maximum Discount</th>
                            <th scope="col">Minimum Order Value</th>
                            <th scope="col">Expiry Date</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>

                            {/* <th scope="col">Tags</th> */}

                            {/* <th scope="col">Vendor</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            coupons &&
                            coupons.map((p, index) => (
                              <>
                                <tr key={p._id}>
                                  <th scope="row">{index + 1}</th>

                                  <td>{p?.CouponType ?? ""}</td>
                                  <td>{p?.CouponName ?? ""}</td>
                                  <td>{p?.CouponAmount ?? 0}</td>
                                  <td>{p?.CouponPercentage ?? 0} %</td>
                                  <td>{p?.MaxDiscount ?? 0}</td>
                                  <td>{p?.Min_Order_value_in_Flat ?? 0}</td>
                                  <td>
                                    {p?.ExpireDate.slice(0, 10)
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                  </td>
                                  <td>
                                    {p.status === 1 ? "Active" : "Inactive"}
                                  </td>

                                  <td>
                                    <span>
                                      <Link
                                        to={`/admin/edit-coupon/${p._id}`}
                                        style={{
                                          backgroundColor: "#198754",
                                          padding: "7px",
                                          borderRadius: "8px",
                                          color: "#fff",
                                        }}
                                      >
                                        <FiEdit />
                                      </Link>
                                    </span>
                                    &nbsp;
                                    <span
                                      style={{
                                        backgroundColor: "#dc3545",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                      }}
                                      onClick={() => handleDeleteClick(p._id)}
                                    >
                                      <AiTwotoneDelete />
                                    </span>
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </table>
                    </div>
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
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="back-top" style={{ display: "none" }}>
        <a title="Go to Top" href="#">
          <i className="ti-angle-up"></i>
        </a>
      </div>
    </>
  );
};

export default Coupon;
