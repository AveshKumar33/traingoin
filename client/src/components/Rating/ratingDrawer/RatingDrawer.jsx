import { useEffect, useState, useCallback } from "react";
// import CreatingRatingDrawer from "../CreatingRatingDrawer/CreatingRatingDrawer";
import "./ratingDrawer.css";
import Rating from "@mui/material/Rating";
import UserRatingCard from "../UserRatingCard/UserRatingCard";
import { axiosInstance } from "../../../config";
import CloseIcon from "@mui/icons-material/Close";
const RatingDrawer = ({
  closeRatingDrawer,
  OpenCreatingRatingDrawer,
  productdetails,
  totalRating,
  totalUser,
  averageRatingInPercentage,
  ratingData,
  model,
}) => {
  const [UserReview, setUserReview] = useState([]);

  const getProductReview = useCallback(async () => {
    if (UserReview.length > 0) {
      return;
    }
    const { data } = await axiosInstance.get(
      `/api/review/product/${productdetails._id}?model=${model}`
    );

    setUserReview(data.data);
  }, [UserReview, productdetails]);

  useEffect(() => {
    getProductReview();
  }, [getProductReview]);

  return (
    <>
      <div id="CartSidebar" className="sidebarHome1">
        <div className="ratingDrawer">
          <div></div>
          <div>
            <p className="Heading-reviews"> Reviews</p>
          </div>
          <div>
            <CloseIcon
              className="fa-solid fa-xmark"
              style={{
                cursor: "pointer",
              }}
              onClick={() => closeRatingDrawer()}
            />
          </div>
        </div>
        <hr />

        <div className="ratingCardData">
          <div style={{ paddingTop: "4px" }}>
            <h3 className="text-center">{totalRating}</h3>
            <div
              className="rating-container"
              style={{
                "--percent": averageRatingInPercentage,
                padding:"var(--box-padding)"
              }}
            >
              <div className="rating">
                <div className="star yellow">
                  <i className="fas fa-star" style={{ fontSize: "15px" }}></i>
                  <i className="fas fa-star" style={{ fontSize: "15px" }}></i>
                  <i className="fas fa-star" style={{ fontSize: "15px" }}></i>
                  <i className="fas fa-star" style={{ fontSize: "15px" }}></i>
                  <i className="fas fa-star" style={{ fontSize: "15px" }}></i>
                </div>
              </div>

              <div className="star grey">
                <i className="far fa-star" style={{ fontSize: "15px" }}></i>
                <i className="far fa-star" style={{ fontSize: "15px" }}></i>
                <i className="far fa-star" style={{ fontSize: "15px" }}></i>
                <i className="far fa-star" style={{ fontSize: "15px" }}></i>
                <i className="far fa-star" style={{ fontSize: "15px" }}></i>
              </div>
            </div>
            <p className="text-center">{totalUser} Reviews</p>
            <p
              className="create-Rating-button"
              style={{
                cursor: "pointer",
              }}
              onClick={() => OpenCreatingRatingDrawer()}
            >
              Write a Review
            </p>
          </div>
          <div className="rating-details">
            <div className="rating-details-children ">
              <Rating name="read-only" readOnly value={5} />
              <p>{ratingData["5"]}</p>
            </div>
            <div className="rating-details-children ">
              <Rating name="read-only" readOnly value={4} />
              <p>{ratingData["4"]}</p>
            </div>
            <div className="rating-details-children ">
              <Rating name="read-only" readOnly value={3} />
              <p>{ratingData["3"]}</p>
            </div>
            <div className="rating-details-children ">
              <Rating name="read-only" readOnly value={2} />
              <p>{ratingData["2"]}</p>
            </div>
            <div className="rating-details-children ">
              <Rating name="read-only" readOnly value={1} />
              <p>{ratingData["1"]}</p>
            </div>
          </div>
        </div>
        <div>
          {UserReview?.length > 0 &&
            UserReview.map((data, index) => (
              <UserRatingCard data={data} key={data._id} index={index} />
            ))}
        </div>
      </div>
    </>
  );
};

export default RatingDrawer;
