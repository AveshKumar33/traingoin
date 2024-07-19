import { useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollectionsDetails,
  updateCollection,
} from "../../../redux/slices/collectionSlice";
import JoditEditor from "jodit-react";
import { MultiSelect } from "react-multi-select-component";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { fetchUsersDetails, updateUser } from "../../../redux/slices/userSlice";
import TopHeader from "../../../components/topheader/TopHeader";
import {
  fetchCouponsDetails,
  updateCoupon,
} from "../../../redux/slices/couponSlice";

const EditCoupon = () => {
  const { loading, coupondetails } = useSelector((state) => state.coupons);
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formdata, setformdata] = useState({
    CouponName: "",
    CouponAmount: "",
    CouponType: "",
    CouponPercentage: "",
    MaxDiscount: "",
    Min_Order_value_in_Flat: 0,
    ExpireDate: "",
    Description: "",
    status: null,
  });

  const {
    CouponName,
    CouponAmount,
    CouponType,
    CouponPercentage,
    MaxDiscount,
    ExpireDate,
    Min_Order_value_in_Flat,
    Description,
    status,
  } = formdata;

  useEffect(() => {
    dispatch(fetchCouponsDetails(id));
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled" && coupondetails) {
      setformdata(coupondetails);
    }

    return () => {
      setformdata({
        CouponName: "",
        CouponAmount: "",
        CouponType: "",
        CouponPercentage: "",
        MaxDiscount: "",
        Min_Order_value_in_Flat: 0,
        ExpireDate: "",
        Description: "",
      });
    };
  }, [loading]);

  const onChange = (e) => {
    if (e.target.name === "CouponName") {
      setformdata({
        ...formdata,
        [e.target.name]: e.target.value.replace(/\s/g, "").toUpperCase(),
      });
    } else {
      setformdata({
        ...formdata,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateddata = {
      id,
      coupondata: {
        CouponName: CouponName.toUpperCase(),
        CouponAmount: CouponType === "Percentage" ? 0 : CouponAmount,
        CouponType,
        CouponPercentage: CouponType !== "Percentage" ? 0 : CouponPercentage,
        MaxDiscount: CouponType !== "Percentage" ? 0 : MaxDiscount,
        ExpireDate,
        Min_Order_value_in_Flat,
        Description,
        status,
      },
    };

    dispatch(updateCoupon(updateddata));

    navigate("/admin/coupon");
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
                        <h3 className="m-0">Coupon</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="Tag Name">
                              Coupon Expiry Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Enter Coupon Name"
                              name="ExpireDate"
                              required
                              // value="2023-07-04"
                              value={ExpireDate?.slice(0, 10)}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="Tag Name">
                              Coupon Type
                            </label>

                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={onChange}
                              value={CouponType}
                              name="CouponType"
                            >
                              <option selected>Open this select menu</option>
                              <option value="Percentage">Percentage</option>
                              <option value="Flat">Flat</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label" htmlFor="Tag Name">
                              Coupon Name
                            </label>
                            <input
                              type="Tag Name"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Enter Coupon Name"
                              name="CouponName"
                              required
                              value={CouponName}
                              style={{
                                textTransform: "uppercase",
                              }}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          {formdata.CouponType !== "Percentage" && (
                            <>
                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="Tag Name"
                                >
                                  Coupon Amount
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className="form-control"
                                  id="Tag Name"
                                  placeholder="Enter Coupon Amount"
                                  name="CouponAmount"
                                  required
                                  value={CouponAmount}
                                  // value={tag}
                                  onChange={onChange}
                                />
                              </div>
                            </>
                          )}
                          {formdata.CouponType !== "Percentage" && (
                            <>
                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="Tag Name"
                                >
                                  Minimum Order Value (Blank if not Applicable)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className="form-control"
                                  id="Tag Name"
                                  placeholder="Enter Coupon Amount"
                                  name="Min_Order_value_in_Flat"
                                  required
                                  value={Min_Order_value_in_Flat}
                                  // value={tag}
                                  onChange={onChange}
                                />
                              </div>
                            </>
                          )}
                          {formdata.CouponType === "Percentage" && (
                            <>
                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="Tag Name"
                                >
                                  Coupon Percentage
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className="form-control"
                                  id="Tag Name"
                                  placeholder="Enter Coupon Amount"
                                  name="CouponPercentage"
                                  required
                                  value={CouponPercentage}
                                  onChange={onChange}
                                />
                              </div>
                            </>
                          )}

                          {formdata.CouponType === "Percentage" && (
                            <>
                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="Tag Name"
                                >
                                  Maximum Discount(Blank is not Applicable)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className="form-control"
                                  id="Tag Name"
                                  placeholder="Enter Coupon Amount"
                                  name="MaxDiscount"
                                  value={MaxDiscount}
                                  // value={tag}
                                  onChange={onChange}
                                />
                              </div>
                            </>
                          )}
                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="FeaturedProducts"
                            >
                              Status
                            </label>
                            <select
                              id="FeaturedProducts"
                              className="form-control"
                              name="status"
                              required
                              value={status}
                              onChange={onChange}
                            >
                              <option selected value="">
                                Choose...
                              </option>
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="Tag Name">
                              Description
                            </label>
                            <textarea
                              type="text"
                              className="form-control"
                              id="Description"
                              placeholder="Description"
                              defaultValue={""}
                              name="Description"
                              value={Description}
                              onChange={onChange}
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

export default EditCoupon;
