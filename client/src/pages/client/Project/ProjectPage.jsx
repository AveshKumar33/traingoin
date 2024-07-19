import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { fetchproject } from "../../../redux/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
import ProjectCard from "../../../components/projectcard/ProjectCard";
import { toastError } from "../../../utils/reactToastify";
import { axiosInstance, REACT_APP_URL } from "../../../config";

const ProjectPage = () => {
  const {
    loading: projectloading,
    project,
    error,
  } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ProjectPage`
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
            marginTop: "150px",
            textTransform: "uppercase",
          }}
        >
          "Railingo project Page"
        </h3> */}
      </div>
      {projectloading === "pending" ? (
        <Preloader />
      ) : project.length > 0 ? (
        <>
          <div className="row my-5">
            <h2 className="mb-5 text-center">See Railingo in action</h2>
            <div className="container">
              <div className="row mx-5">
                {project &&
                  project.map((p) => {
                    return (
                      <>
                        <ProjectCard
                          key={p._id}
                          Name={p.ProjectName}
                          id={p._id}
                          image={p.ProjectImage[0]}
                        />
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h6 className="text-center">Project Not Found 😒</h6>
        </>
      )}

      <MainFooter />
    </>
  );
};

export default ProjectPage;
