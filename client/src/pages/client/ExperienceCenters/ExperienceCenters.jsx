import React, { useCallback, useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { Link } from "react-router-dom";
import "./ExperienceCenters.css";

import { useDispatch, useSelector } from "react-redux";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { fetchExperience } from "../../../redux/slices/experienceSlice";
import Experienceslider from "./ExperiencesliderOLD";
import { toastError } from "../../../utils/reactToastify";
const ExperienceCenters = () => {
  const { Experience } = useSelector((state) => state.experience);

  const [blog, setblog] = useState([]);
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const scorllToRef = useRef();
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ExperienceCenters`
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
    getblog();
  }, []);
  useEffect(() => {
    dispatch(fetchExperience());
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
          Our Experience Centers
        </h3> */}
      </div>{" "}
      <h3
        style={{
          textAlign: "left",
          color: "#475B52",
          marginTop: "30px",
          textTransform: "uppercase",
          fontSize: "20px",
          marginLeft: "20px",
        }}
      >
        LOCATE US
      </h3>
      <div className="row" style={{ padding: "0px", margin: "0px" }}>
        {Experience &&
          Experience.length > 0 &&
          Experience.map((experience) => (
            <div className="row" style={{ padding: "0px", margin: "0px" }}>
              <div
                className="col-lg-4"
                style={{ float: "left", paddingTop: "10px" }}
              >
                {/* <img
                  src={SliderImg1}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                    height: "40vh",
                  }}
                ></img> */}
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
                  to={`/single-experience-centers/${experience._id}`}
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
                  to={`/single-experience-centers/${experience._id}`}
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
        {/* <div
          className="row"
          style={{
            padding: "20px",
            backgroundColor: "#eee",
            borderRadius: "10px",
          }}
        >
          <div className="col-lg-3" style={{ float: "left" }}>
            <img
              src={SliderImg1}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                height: "40vh",
              }}
            ></img>
          </div>
          <div
            className="col-lg-9"
            style={{
              textAlign: "center",
              float: "left",
              padding: "20px 50px 20px 50px",
            }}
          >
            <p style={{ textAlign: "center", color: "#000", fontSize: "30px" }}>
              RAILINGO GURGAON
            </p>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "600",
                letterSpacing: "2px",
                color: "#475B52",
              }}
            >
              EXPERIENCE CENTER
            </h2>
            New Typologies, New Materials, New Finishes. Visit the WALTZ
            Experience Center at Gurgaon (NCR), to witness our latest
            innovations in Doors and Partition Systems.
            <br></br>
            <br></br>
            <a
              href="/SingleExperienceCenters"
              style={{
                borderRadius: "10px",
                padding: "10px 20px 10px 20px",
                backgroundColor: "#475B52",
                color: "#fff",
              }}
            >
              View More
            </a>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="row" style={{ padding: "20px" }}>
          <div className="col-lg-3" style={{ float: "left" }}>
            <img
              src={SliderImg1}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                height: "40vh",
              }}
            ></img>
          </div>
          <div
            className="col-lg-9"
            style={{
              textAlign: "center",
              float: "left",
              padding: "20px 50px 20px 50px",
            }}
          >
            <p style={{ textAlign: "center", color: "#000", fontSize: "30px" }}>
              RAILINGO GURGAON
            </p>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "600",
                letterSpacing: "2px",
                color: "#475B52",
              }}
            >
              EXPERIENCE CENTER
            </h2>
            New Typologies, New Materials, New Finishes. Visit the WALTZ
            Experience Center at Gurgaon (NCR), to witness our latest
            innovations in Doors and Partition Systems.
            <br></br>
            <br></br>
            <a
              href="/SingleExperienceCenters"
              style={{
                borderRadius: "10px",
                padding: "10px 20px 10px 20px",
                backgroundColor: "#475B52",
                color: "#fff",
              }}
            >
              View More
            </a>
          </div>
        </div> */}
      </div>
      <MainFooter />
    </>
  );
};

export default ExperienceCenters;
