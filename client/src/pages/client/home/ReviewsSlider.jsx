import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { REACT_APP_URL } from "../../../config";

const ReviewsSlider = ({ reviews }) => {
  const [showAllList, setShowAllList] = useState(reviews.map(() => false));
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const toggleShowAll = (index) => {
    const newShowAllList = [...showAllList];
    newShowAllList[index] = !newShowAllList[index];
    setShowAllList(newShowAllList);
  };

  return (
    <div className="container-fluid" style={{ padding: "10px 20px 10px 20px" }}>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index}>
            <div
              style={{
                border: "1px solid #eee",
                textAlign: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                margin: "10px",
                backgroundColor: "#fff",
                height: "70vh",
              }}
            >
              <img
                src={`${REACT_APP_URL}/images/review/${review.ReviewPicture}`}
                style={{
                  height: "45vh",
                  width: "100%",
                  // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
                alt="Review Image"
              />
              <div style={{ padding: "15px" }}>
                <h4 style={{ fontSize: "18px" }}>{review.Name}</h4>
                <p style={{ textAlign: "justify" }}>
                  {review.ReviewBody.slice(0, 243)}
                </p>
                {/* {review.ReviewBody && review.ReviewBody.length < 150 ? (
                  <p style={{ textAlign: "justify" }}>{review.ReviewBody}</p>
                ) : showAllList[index] ? (
                  <p style={{ textAlign: "justify" }}>
                    {review.ReviewBody} &nbsp;&nbsp;
                    <span
                      style={{ color: "#475B52" }}
                      onClick={() => toggleShowAll(index)}
                    >
                      Read Less...
                    </span>
                  </p>
                ) : (
                  <p style={{ textAlign: "justify" }}>
                    {review.ReviewBody.slice(0, 150)}&nbsp;&nbsp;
                    <span
                      style={{ color: "#475B52" }}
                      onClick={() => toggleShowAll(index)}
                    >
                      Read More...
                    </span>
                  </p>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default ReviewsSlider;
