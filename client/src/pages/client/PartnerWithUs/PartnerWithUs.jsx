import React, { useCallback, useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import "../PartnerWithUs/PartnerWithUs.css";
import { useSelector, useDispatch } from "react-redux";
import ReviewsSlider from "../home/ReviewsSlider";
import { fetchReview } from "../../../redux/slices/reviewSlice";
import { toastError } from "../../../utils/reactToastify";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import FeelFreeToContactUs from "../home/FeelFreeToContactUs";

const PartnerWithUs = () => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.review);
  const [blog, setblog] = useState([]);
  const [partnerWithUs, setPartnerWithUs] = useState([]);
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const [contactUs, setContactUs] = useState({});
  const scorllToRef = useRef();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/PartnerWithUs`
      );
      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  const partnerWithus = partnerWithUs.filter(
    (obj) => obj.status === "partenerWithUs"
  );
  let partnerWithUsData = partnerWithus ?? [];
  const getblog = async () => {
    try {
      setloading(true);
      const { data } = await axiosInstance.get("/api/blog");
      setblog(data.blog);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("error", error.response.data.message);
    }
  };

  async function featchAllData() {
    try {
      const { data } = await axiosInstance.get("/api/partner-with-us");
      if (data.success) {
        setPartnerWithUs(data.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    featchAllData();
  }, []);

  /**fetch contactUsImage && contactUsVideo */
  useEffect(() => {
    async function featchAllContactUsData() {
      try {
        const { data } = await axiosInstance.get(
          `/api/partner-with-us/contactUs/details`
        );
        if (data.success) {
          setContactUs(data.data);
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    }
    featchAllContactUsData();
  }, []);

  useEffect(() => {
    getblog();
  }, []);
  useEffect(() => {
    dispatch(fetchReview());
  }, [dispatch]);

  const setselecedpage = (page) => {
    if (page < 1 || page > Math.ceil(blog.length / 10)) {
      return;
    }
    setpages(page);
    scorllToRef.current.scrollIntoView();
  };
  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      >
        {/* <h3
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "200px",
            textTransform: "uppercase",
            fontSize: "30px",
          }}
        >
          Partner With Us
        </h3> */}
      </div>{" "}
      <div className="row">
        <div className="col-lg-8">
          <div
            className="col-lg-7"
            style={{ padding: "40px 0px 10px 40px", float: "left" }}
          >
            <h4 style={{ textTransform: "uppercase", fontWeight: "600" }}>
              Why Become A Partner With Us
            </h4>
            <p>
              <VscDebugBreakpointLogUnverified /> There is Zero Inventory Risk
              <br></br>
              <VscDebugBreakpointLogUnverified /> We will Fulfil the Orders &
              Provide After Sale Service<br></br>
              <VscDebugBreakpointLogUnverified /> We Support with Marketing,
              Operations & Staff Training<br></br>
            </p>
          </div>
          <div
            className="col-lg-5"
            style={{
              backgroundImage: `url(${REACT_APP_URL}/images/clientImages/${partnerWithUsData[0]?.pwusImage})`,
              float: "left",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "40vh",
              marginTop: "20px",
              borderRadius: "10px",
            }}
          ></div>
          <div className="col-lg-12 Partnerwithustopleftdiv">
            <h4 style={{ textTransform: "uppercase", fontWeight: "600" }}>
              Multiple Business Models
            </h4>
            <p style={{ fontSize: "18px" }}>
              Railingo Accelerator Program(RAP)
            </p>
            <table class="table table-striped">
              <tr>
                <th>Minimum Investment</th>
                <td>80 Lakhs</td>
              </tr>
              <tr>
                <th>Minimum Store Space</th>
                <td>1500 sq.ft</td>
              </tr>
              <tr>
                <th>Payback Period</th>
                <td>24 Months</td>
              </tr>
            </table>

            <br></br>
            <p style={{ fontSize: "18px" }}>Railingo Venture Program(RVP)</p>
            <table className="table table-striped">
              <tr>
                <th>Minimum Investment</th>
                <td>1 Crore 25 Lakhs</td>
              </tr>
              <tr>
                <th>Minimum Store Space</th>
                <td>3500 sq.ft</td>
              </tr>
              <tr>
                <th>Payback Period</th>
                <td>24 Months</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="col-lg-4 GetStartedStyle">
          <h2
            style={{
              textTransform: "uppercase",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Get Started
          </h2>
          <br></br>
          <div className="col-lg-11">
            <label
              style={{
                fontWeight: "600",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
            >
              Name
            </label>
            <input className="form-control"></input>
          </div>
          <br></br>
          <div className="col-lg-11">
            <label
              style={{
                fontWeight: "600",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
            >
              Email Id
            </label>
            <input className="form-control"></input>
          </div>
          <br></br>
          <div className="col-lg-11">
            <label
              style={{
                fontWeight: "600",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
            >
              Mobile No.
            </label>
            <input className="form-control"></input>
          </div>
          <br></br>
          <div className="col-lg-11">
            <label
              style={{
                fontWeight: "600",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
            >
              OTP
            </label>
            <input className="form-control"></input>
          </div>
          <br></br>
          <div className="col-lg-11">
            <label
              style={{
                fontWeight: "600",
                letterSpacing: "1px",
                fontSize: "14px",
              }}
            >
              City
            </label>
            <select className="form-control">
              <option>Select City</option>
              <option>City 1</option>
              <option>City 2</option>
            </select>
          </div>
          <br></br>
          <center>
            <input
              type="submit"
              style={{
                border: "none",
                backgroundColor: "#475B52",
                color: "#fff",
                padding: "10px 20px 10px 20px",
                width: "50%",
                borderRadius: "10px",
              }}
            ></input>
          </center>
        </div>
      </div>
      {contactUs.contactUsVideo &&
        Object.keys(contactUs).length > 0 &&
        Object.keys(contactUs.contactUsVideo).length > 0 && (
          <div
            className="row feelfreetocontactusstyle"
            style={{ position: "relative" }}
          >
           <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: "-2",
                background:
                  "linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5))",
              }}
            ></div>
            <video
              className="background-video"
              autoPlay
              loop
              muted
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: "-3",
              }}
            >
              <source
                src={`${REACT_APP_URL}/images/clientImages/${contactUs.contactUsVideo?.pwusImage}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div
              className="parallel-image-section"
              style={{ paddingTop: "50px" }}
            >
              <div className="content">
                <center>
                  <h1
                    className="feelfreetocontactusheadingstyle"
                    style={{
                      color: "#fff",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Feel Free to contact us
                  </h1>
                  <p style={{ color: "#fff", fontSize: "18px" }}>
                    Feel free to reach out to us for all your home decor needs.
                    We're here to assist you in turning your dreams into
                    reality.
                  </p>
                  <br></br>
                  <div className="col-lg-2" style={{ float: "left" }}>
                    &nbsp;
                  </div>
                  <div className="col-lg-8" style={{ float: "left" }}>
                    <FeelFreeToContactUs />
                  </div>
                  <div className="col-lg-2" style={{ float: "left" }}>
                    &nbsp;
                  </div>
                </center>
              </div>
            </div>
          </div>
        )}
      <div
        className="row"
        style={{ marginTop: "30px", paddingRight: "0px", paddingLeft: "15px" }}
      >
        <p
          style={{
            color: "#818181",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          OUR CLIENTS
        </p>
        <h1
          style={{ textAlign: "center", textTransform: "uppercase" }}
          // className="mb-5"
        >
          WHAT OUR CLIENTS SAYS ?
        </h1>
        {reviews && reviews.length > 0 && <ReviewsSlider reviews={reviews} />}
      </div>
      <br></br>
      <MainFooter />
    </>
  );
};

export default PartnerWithUs;
