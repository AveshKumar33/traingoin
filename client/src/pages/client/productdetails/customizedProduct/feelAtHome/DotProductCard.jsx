import React from "react";
import { Link } from "react-router-dom";
import { REACT_APP_URL } from "../../../../../config";
import ReadMore from "../../../../../components/ReadMore/ReadMore";
import "./DotProductCard.css";

export const DotProductCard = ({
  product,
  index,
  total,
  handleOpen,
  isModal,
}) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      className={index === 0 ? "carousel-item active" : "carousel-item"}
    >
      {/* <Link to={`/customize-room-idea/${product?.dotProductId?._id}`}> */}
      <div
        style={{
          borderRadius: "5%",
          boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
        }}
      >
        <div
          className="col-lg-6 FeelAtHomeSectionStyle1"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="col-lg-9" style={{ float: "left" }}>
              <p style={{ fontSize: "18px", marginRight: "10px" }}>{`${
                index + 1
              }/${total}`}</p>
            </div>
            <div className="col-lg-3" style={{ float: "left" }}>
              <button
                type="button"
                className="btn btn-transparent mr-2"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
                style={{ marginTop: "-12px" }}
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                  style={{ height: "1rem", width: "1rem" }}
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                type="button"
                className="btn btn-transparent"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
                style={{ marginTop: "-12px" }}
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                  style={{ height: "1rem", width: "1rem" }}
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <br />
          <h4
            style={{
              color: "#475B52",
              letterSpacing: "1px",
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "21px",
            }}
            onClick={handleOpen}
          >
            {product?.dotProductId?.name}
          </h4>
          <ReadMore>{product?.dotProductId?.Description}</ReadMore>
        </div>
        <div
          className="col-lg-6 ImageContainer FeelAtHomeSectionStyle2"
          onClick={handleOpen}
        >
          {/* {console.log("dot products ", dotproduct)} */}
          <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/dotimage/${product?.image}`}
            style={{
              width: "100%",
              maxHeight: "80vh",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}
            alt={product?.dotProductId?.name}
          />
          {product &&
            product?.dots.length > 0 &&
            product?.dots?.map((p, i) => (
              <React.Fragment key={i}>
                <div
                  className="Dot fa fa-circle text-danger-glow blink"
                  key={p._id}
                  style={{ left: `${p.positionX}%`, top: `${p.positionY}%` }}
                ></div>
                <span
                  className="blink"
                  style={{
                    left: `${p.positionX + 4}%`,
                    top: `${p.positionY + 1}%`,
                    position: "absolute",
                    backgroundColor: "#3e6554",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "3px",
                    border: "1px solid #fff",
                    textDecoration: "none",
                  }}
                >
                  <p
                    style={{
                      color: "#fff",
                      marginBottom: "0",
                      borderBottom: "none",
                    }}
                  >
                    {p?.productId?.ProductName?.slice(0, 10)}
                  </p>
                </span>
              </React.Fragment>
            ))}
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};
