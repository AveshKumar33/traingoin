import React, { useState, useCallback, useEffect } from "react";
import "./contact.css";
import Header from "../../../components/header/Header";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import Footer from "../../../components/footer/Footer";
import MainFooter from "../../../components/mainfooter/MainFooter";
import EnquiryForm from "../../../components/enquiryform/EnquiryForm";
import BackOverlay from "../../../assets/Image/team-bg.jpg";
import reCAPTCHA from "react-google-recaptcha";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchExperience } from "../../../redux/slices/experienceSlice";
import Experienceslider from "../ExperienceCenters/ExperiencesliderOLD";

import { Link } from "react-router-dom";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";

const Contact = () => {
  const dispatch = useDispatch();
  const { Experience } = useSelector((state) => state.experience);
  const [headerImage, setHeaderImage] = useState({});

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Contact`
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
    dispatch(fetchExperience());
  }, [dispatch]);

  return (
    <>
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
        <div className="row" style={{ backgroundColor: "#fff" }}>
          <div className="container querysectionstyle">
            <EnquiryForm />

            {/* <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3473.520476331905!2d77.72761627443201!3d29.472009745467442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c1bf1c3bf66d1%3A0x9ca29aa414c8f0f4!2sRailingo%20Private%20Limited!5e0!3m2!1sen!2sin!4v1693631692864!5m2!1sen!2sin"
              style={{ width: "100%", height: "400px" }}
              className="mapstyle"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            /> */}
          </div>
        </div>
        <br></br>
        <div className="row" style={{ padding: "0px", margin: "0px" }}>
          <p style={{ color: "#818181", textAlign: "center" }}>Our Centers</p>
          <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
            Our Experience Centers
          </h1>
          <br></br>
          {Experience &&
            Experience.length > 0 &&
            Experience.map((experience, i) => (
              <div
                key={i}
                className="row"
                style={{ padding: "0px", margin: "0px" }}
              >
                <div
                  className="col-lg-4"
                  style={{ float: "left", paddingTop: "10px" }}
                >
                  <Experienceslider
                    slider={experience.experienceImages}
                    video={experience?.video}
                    type={"experience"}
                  />
                </div>
                <div
                  className="col-lg-8 experiencecenterstyle"
                  style={{ backgroundImage: `url(${BackgroundImageRight})` }}
                >
                  <p className="experiencecentername">{experience.name}</p>
                  <h2 className="experiencecenter">EXPERIENCE CENTER</h2>
                  <b>Contact Person :</b> {experience.contactPerson}
                  <br />
                  <b>Email :</b> {experience.email} &nbsp;&nbsp;|&nbsp;&nbsp;
                  <b>Mob. No. :</b> {experience.mobNumber} <br />
                  <b>Address :</b> {experience.description}
                  <br></br>
                  <br></br>
                  <Link
                    to={`/SingleExperienceCenters/${experience._id}`}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 20px 10px 20px",
                      backgroundColor: "#475B52",
                      color: "#fff",
                      zoom: "80%",
                      letterSpacing: "1px",
                    }}
                  >
                    View More
                  </Link>{" "}
                  &nbsp;&nbsp;
                  <Link
                    to={`/SingleExperienceCenters/${experience._id}`}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 20px 10px 20px",
                      backgroundColor: "#A08862",
                      color: "#fff",
                      zoom: "80%",
                      letterSpacing: "1px",
                    }}
                  >
                    Get Location
                  </Link>
                </div>
              </div>
            ))}
          <br></br>
          <br></br>
        </div>
        <MainFooter></MainFooter>
      </>
    </>
  );
};

export default Contact;
