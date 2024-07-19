import React, { useCallback, useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchExibhitions } from "../../../redux/slices/exibhitionsSlice";
import ExibhitionsSlider from "./ExibhitionsSlider";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import BackgroundImageLeft from "../../../assets/Image/BackgroundImageLeft.png";
import "./Exibhitions.css";
import { toastError } from "../../../utils/reactToastify";

const Exibhitions = () => {
  const { exibhitions } = useSelector((state) => state.exibhitions);
  const dispatch = useDispatch();

  const [blog, setblog] = useState([]);
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const scorllToRef = useRef();

  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Exibhitions`
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

  useEffect(() => {
    dispatch(fetchExibhitions());
  }, [dispatch]);

  useEffect(() => {
    getblog();
  }, []);

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
          Our Exibhitions
        </h3> */}
      </div>{" "}
      <div className="container-fluid">
        {exibhitions &&
          exibhitions.length > 0 &&
          exibhitions.map((exibhition, index) =>
            index % 2 !== 0 ? (
              <div
                className="row"
                style={{
                  padding: "0px",
                  // borderRadius: "10px",
                }}
              >
                <div
                  className="col-lg-4"
                  style={{ float: "left", padding: "20px" }}
                >
                  <ExibhitionsSlider
                    slider={exibhition.exibhitionsImages}
                    video={exibhition.video}
                    type={"exibhitions"}
                  />
                </div>
                <div
                  className="col-lg-8 ExibhitionContent"
                  style={{ backgroundImage: `url(${BackgroundImageRight})` }}
                >
                  {/* <p style={{ textAlign: "center", color:"#000", fontSize:"30px"}}>RAILINGO GURGAON</p> */}
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      color: "#475B52",
                      textTransform: "uppercase",
                      fontFamily: "Macondo, cursive",
                    }}
                  >
                    {exibhition.title}
                  </h2>
                  {exibhition.description}
                </div>
              </div>
            ) : (
              <div
                className="row"
                style={{
                  padding: "0px",
                }}
              >
                <div
                  className="col-lg-8 ExibhitionContent"
                  style={{
                    backgroundImage: `url(${BackgroundImageLeft})`,
                  }}
                >
                  {/* <p style={{ textAlign: "center", color:"#000", fontSize:"30px"}}>RAILINGO GURGAON</p> */}
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      color: "#475B52",
                      textTransform: "uppercase",
                      fontFamily: "Macondo, cursive",
                    }}
                  >
                    {exibhition.title}
                  </h2>
                  {exibhition.description}
                </div>
                <div
                  className="col-lg-4"
                  style={{ float: "left", padding: "20px" }}
                >
                  <ExibhitionsSlider
                    slider={exibhition.exibhitionsImages}
                    video={exibhition.video}
                    type={"exibhitions"}
                  />
                </div>
              </div>
            )
          )}
      </div>
      <MainFooter />
    </>
  );
};

export default Exibhitions;
