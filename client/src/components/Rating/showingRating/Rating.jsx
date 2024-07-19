import React from "react";
import "./rating.css";

import { useState } from "react";
import RatingDrawer from "../ratingDrawer/RatingDrawer";
import CreatingRatingDrawer from "../CreatingRatingDrawer/CreatingRatingDrawer";
import { axiosInstance } from "../../../config";

const Rating = ({
  totalRating = 0,
  totalUser = 0,
  model,
  productdetails,
  setUserRatingData,
  ratingData,
  getTotalRating,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [CreatingisOpen, setCreatingIsOpen] = useState(false);
  // console.log("totalRating", totalRating);
  // console.log("==totalUser==", totalUser);
  const averageRating = () => {
    if (totalUser === 0) {
      return "0.0";
    }
    let rating = totalRating / totalUser;
    return rating.toFixed(1);
  };
  const averageRatingInPercentage = () => {
    if (totalUser === 0) {
      return "0%";
    }
    const percentage = (totalRating / (totalUser * 5)) * 100;

    return `${percentage}%`;
  };

  const closeRatingDrawer = () => {
    setIsOpen(false);
  };

  const closeCreatingRatingDrawer = () => {
    setCreatingIsOpen(false);
  };
  const OpenCreatingRatingDrawer = () => {
    setCreatingIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <RatingDrawer
          closeRatingDrawer={closeRatingDrawer}
          OpenCreatingRatingDrawer={OpenCreatingRatingDrawer}
          productdetails={productdetails}
          totalRating={averageRating()}
          totalUser={totalUser}
          averageRatingInPercentage={averageRatingInPercentage()}
          ratingData={ratingData}
          model={model}
        />
      )}

      {CreatingisOpen && (
        <CreatingRatingDrawer
          closeCreatingRatingDrawer={closeCreatingRatingDrawer}
          productdetails={productdetails}
          setUserRatingData={setUserRatingData}
          model={model}
          getTotalRating={getTotalRating}
        />
      )}
      <div className="rating-div">
        <div style={{ paddingTop: "4px" }}>
          <div
            className="rating-container"
            style={{
              "--percent": averageRatingInPercentage(),
            }}
            onClick={() => {
              setIsOpen(true);
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
        </div>
        <div>
          {" "}
          <p className="average-rating-text">{averageRating()}</p>
        </div>
        {/* <div>
          <p
            style={{
              textDecoration: "none",
              cursor: "pointer",
              color: "#475B52",
            }}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            {totalUser} Customer Reviews
          </p>
        </div> */}
      </div>
    </>
  );
};

export default Rating;
