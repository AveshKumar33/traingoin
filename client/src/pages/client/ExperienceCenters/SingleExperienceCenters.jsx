import React, { useCallback, useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_URL } from "../../../config";
import { useParams } from "react-router-dom";
import { fetchExperienceDetails } from "../../../redux/slices/experienceSlice";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import "./SingleExperienceCenter.css";
import { toastError } from "../../../utils/reactToastify";

const SingleExperienceCenters = () => {
  const { id } = useParams();
  const { Experiencedetails } = useSelector((state) => state.experience);
  const dispatch = useDispatch();
  const [blog, setblog] = useState([]);
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const scorllToRef = useRef();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/SingleExperienceCenters`
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
    dispatch(fetchExperienceDetails(id));
  }, [dispatch, id]);

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
          {Experiencedetails?.name}
        </h3> */}
      </div>{" "}
      <div
        className="row"
        style={{
          padding: "20px",
          backgroundImage: `url(${BackgroundImageRight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="col-lg-12 Singleexperiencecenterdiv">
            <p className="Singleexperiencecentername">
              {Experiencedetails?.name}
            </p>
            <h2 className="Singleexperiencecenterheading">EXPERIENCE CENTER</h2>
            <b>Contact Person :</b> {Experiencedetails.contactPerson}
            <br />
            <b>Email :</b> {Experiencedetails.email} &nbsp;&nbsp;|&nbsp;&nbsp;
            <b>Mob. No. :</b> {Experiencedetails.mobNumber} <br />
            <b>Address :</b> {Experiencedetails.description}
          </div>
          <br></br>
          <br></br>

          <br></br>

          {Experiencedetails &&
            Experiencedetails?.experienceImages?.length > 0 &&
            Experiencedetails?.experienceImages.map((img) => (
              <div
                className="col-lg-3"
                style={{ float: "left", marginTop: "20px" }}
              >
                <img
                  className="singleexperiencecenterimagestyle"
                  src={`${REACT_APP_URL}/images/experience/${img}`}
                ></img>
              </div>
            ))}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default SingleExperienceCenters;
