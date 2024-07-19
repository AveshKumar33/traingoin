import React, { useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { fetchAboutUs } from "../../../redux/slices/aboutUsSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AboutUsSlider from "./AboutUsSlider";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import BackgroundImageLeft from "../../../assets/Image/BackgroundImageLeft.png";
import { useCallback } from "react";
import { toastError } from "../../../utils/reactToastify";

const CompletedProject = () => {
  const { loading, aboutUs } = useSelector((state) => state.aboutUs);
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/AboutUs`
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

  useEffect(() => {
    dispatch(fetchAboutUs());
  }, [dispatch]);

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
      ></div>
      <div className="container-fluid">
        {aboutUs &&
          aboutUs.length > 0 &&
          aboutUs.map((about, index) =>
            index % 2 !== 0 ? (
              <div
                className="row"
                style={{ padding: "0px", backgroundColor: "#eee" }}
              >
                <div
                  className="col-lg-4"
                  style={{ float: "left", padding: "20px" }}
                >
                  {/* <img
                    src={SliderImg1}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                      height: "50vh",
                    }}
                  ></img> */}
                  <AboutUsSlider
                    slider={about.aboutUsImages}
                    type={"aboutUs"}
                  />
                </div>
                <div
                  className="col-lg-8"
                  style={{
                    textAlign: "center",
                    float: "left",
                    padding: "20px 50px 20px 50px",
                    backgroundImage: `url(${BackgroundImageRight})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      color: "#475B52",
                      fontFamily: "Macondo, cursive",
                    }}
                  >
                    {about.title}
                  </h2>
                  <br></br>
                  <p
                    style={{
                      textAlign: "justify",
                      fontSize: "17px",
                      letterSpacing: "1px",
                    }}
                  >
                    {about.description}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="row"
                style={{
                  padding: "0px",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="col-lg-8"
                  style={{
                    textAlign: "center",
                    float: "left",
                    padding: "20px 50px 20px 50px",
                    backgroundImage: `url(${BackgroundImageLeft})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      letterSpacing: "2px",
                      color: "#475B52",
                      fontFamily: "Macondo, cursive",
                    }}
                  >
                    {about.title}
                  </h2>
                  <br></br>
                  <p
                    style={{
                      textAlign: "justify",
                      fontSize: "17px",
                      color: "#000",
                      letterSpacing: "1px",
                    }}
                  >
                    {about.description}
                  </p>
                </div>
                <div
                  className="col-lg-4"
                  style={{ float: "left", padding: "20px" }}
                >
                  {/* <img
                    src={SliderImg1}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                      height: "50vh",
                    }}
                  ></img> */}
                  <AboutUsSlider
                    slider={about.aboutUsImages}
                    type={"aboutUs"}
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

export default CompletedProject;
