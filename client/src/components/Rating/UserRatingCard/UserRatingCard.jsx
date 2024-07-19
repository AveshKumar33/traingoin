import React from "react";
import "./UserRatingCard.css";
import { Rating } from "@mui/material";
import { REACT_APP_URL } from "../../../config";
import { returnCardDate } from "../../../utils/usefullFunction";
const UserRatingCard = ({ data, index}) => {
  return (
    <div className="user-rating-main" style={{ backgroundColor: index % 2 === 0 ? '#F2F2F2' : '#FFFFFF' }}>
    <div className="user-rating-main-top">
        <div className="user-rating-main-top-user">
          <div className="user-rating-user-profile">
            {data?.Name.charAt(0).toUpperCase()}
            <i className="user-rating-checkmark iconfont iconreview_avatar_verified_buyer" />
          </div>{" "}
          &nbsp;
          <div className="user-rating-user-info">
            <div className="user-rating-user-name">
              <span className="user-rating-name">{data?.Name}</span>{" "}
              <span className="user-rating-verified">Verified Buyer</span>
            </div>{" "}
            <Rating name="read-only" readOnly value={data?.Rating} />
          </div>
        </div>{" "}
        <div className="user-rating-main-date">
          {returnCardDate(data.createdAt)}
        </div>
      </div>{" "}
      <div className="user-rating-content-warp">
        <div className="user-rating-main-title">{data?.ReviewTitle}</div>{" "}
        <div className="user-rating-main-default">
          {data?.ReviewBody}
          {/**/}
        </div>{" "}
        <div className="user-rating-photos photos-area">
          {data?.ReviewPicture &&
            data.ReviewPicture.length > 0 &&
            data.ReviewPicture.map((ele) => {
              return (
                <div className="user-rating-photos-item" key={ele} style={{height:"60px", width:"60px"}}>
                  <img
                    loading="lazy"
                    style={{ height: "70px", width: "70px" }}
                    src={`${REACT_APP_URL}/images/review/${ele}`}
                    // src={`http://localhost:8002/images/review/${ele}`}
                    alt="Railingo"
                    className="user-rating-img"
                  />
                </div>
              );
            })}
        </div>{" "}
      </div>
    </div>
  );
};

export default UserRatingCard;
