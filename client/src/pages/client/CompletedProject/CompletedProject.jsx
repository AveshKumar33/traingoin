import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { fetchproject } from "../../../redux/slices/projectSlice";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../../components/preloader/Preloader";
import CompleteProjectSlider from "../home/CompleteProjectSlider";
import "./CompletedProject.css";
import { toastError } from "../../../utils/reactToastify";

const CompletedProject = () => {
  const { loading, project } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/CompletedProject`
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
    dispatch(fetchproject());
  }, [dispatch]);

  function giveString(str) {
    let description = str
      .replace(/<\/?(p|br|span)(\/)?>/g, (match) =>
        match === "<br>" ? " " : ""
      )
      .replace(/<\/?p>/g, "")
      .replace(/<span[^>]*>/g, "")
      .replace(/<\/span>/g, "")
      .slice(0, 150)
      .replaceAll();

    let truncatedDescription = description.split("").splice(0, 140).join("");
    if (description.length > 140) {
      truncatedDescription += " .......";
    }

    return truncatedDescription;
  }

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }
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
      ></div>{" "}
      <div className="container-fluid">
        <div className="row CompletedProjectpagestyle">
          {project &&
            project.length > 0 &&
            project.map((pro) => (
              <div
                className="col-lg-6 d-flex justify-content-end"
                style={{
                  paddingRight: "0px",
                  paddingLeft: "5px",
                  marginTop: "10px",
                }}
              >
                {/* <div
                  className="col-lg-11 custom-col completedprojectsheading3"
                  style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${SliderImg1})`,
                    height: "80vh",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px",
                    marginBottom: "80px",
                  }}
                > */}
                <CompleteProjectSlider
                  id={pro?._id}
                  project={pro}
                  images={pro?.ProjectImage}
                  giveString={giveString}
                >
                  {/* <center>
                    <h4>
                      {pro.ProjectName}
                      <br></br>
                      <span style={{ fontSize: "12px", fontWeight: "500" }}>
                        ( {pro?.ProjectCategory?.Name} )
                      </span>
                      <br></br>
                      <br></br>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          textAlign: "justify !important",
                          textTransform: "capitalize !important",
                          letterSpacing: "1px",
                        }}
                      >
                        {giveString(pro?.ProjectDescription)}
                      </span>
                    </h4>
                  </center> */}
                </CompleteProjectSlider>
                {/* </div> */}
              </div>
            ))}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default CompletedProject;
