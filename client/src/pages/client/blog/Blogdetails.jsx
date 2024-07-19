import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import "./newblog.css";
import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

const Blogdetails = () => {
  const { url } = useParams();
  const [blog, setblog] = useState();
  const [loader, setloader] = useState(false);
  const [notfound, setnotfound] = useState(false);
  const [isopen, setisopen] = useState(true);
  const [name, setName] = useState();
  const [phone, setphone] = useState();
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Blogdetails`
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

  const getblogdetails = async () => {
    try {
      setloader(true);
      const { data } = await axiosInstance.get(
        `/api/blog/fetchblogbyurl/${url}`
      );
      if (data.success) {
        setloader(false);
        setblog(data.blog);
      }
      console.log("ddd", blog);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getblogdetails();
  }, []);

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
        
      </div>

      <div className="my-5">
        {blog !== null ? (
          <>
            <h1 className=" text-center">
              <b>{blog?.heading}</b>
            </h1>
          </>
        ) : (
          <>
            <h1 className=" text-center">
              <b>{"Sorry 😭! , Page Not Found (404)"}</b>
            </h1>
          </>
        )}
      </div>
      <div className="container mb-5">
        {loader ? (
          <>
            <div
              className="row d-flex justify-content-center align-items-center position-relative top-50 mt-5 "
              style={{ height: "20vh" }}
            >
              <div className="col-md-8 text center position-absolute top-40 start-50">
                <div class="spinner-border text-dark " role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          blog !== null && (
            <>
              <div className="row text-dark ">
                <div className="col-md-12 text-dark blogs">
                  {parse(`${blog?.content}`)}
                </div>
              </div>
            </>
          )
        )}
      </div>
      <MainFooter />
    </>
  );
};

export default Blogdetails;
