import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { fetchReviewDetails } from "../../../redux/slices/reviewSlice";
import { useDispatch, useSelector } from "react-redux";
import MainFooter from "../../../components/mainfooter/MainFooter";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import { toastError } from "../../../utils/reactToastify";

function ReviewModal() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { reviewdetails, loading } = useSelector((state) => state.review);
  const [review, swtReview] = useState({});
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ReviewModal`
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
    dispatch(fetchReviewDetails(id));
    if (loading === "fulfilled") {
      swtReview(reviewdetails);
    }
  }, [id]);

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
      />
      {Object.keys(reviewdetails).length > 0 && (
        <div
          style={{
            border: "1px solid #eee",
            textAlign: "center",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={`${REACT_APP_URL}/images/review/${reviewdetails?.ReviewPicture[0]}`}
            style={{
              height: "45vh",
              width: "100%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}
            alt="Review Image"
          />
          <div style={{ padding: "15px" }}>
            <h4 style={{ fontSize: "18px" }}>{reviewdetails?.Name}</h4>

            <p style={{ textAlign: "justify" }}>{reviewdetails?.ReviewBody}</p>
          </div>
        </div>
      )}
      <MainFooter />
    </>
  );
}

export default ReviewModal;
