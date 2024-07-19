import React from "react";
import { REACT_APP_URL } from "../../../config";
import { Link } from "react-router-dom";
import ReadMore from "../../../components/ReadMore/ReadMore";
import { useNavigate } from "react-router-dom";

export const DotCusProductcard = ({
  dotproduct,
  index,
  total,
  removeProduct,
}) => {
  const navigate = useNavigate();

  return (
    <div className={index === 0 ? "carousel-item active" : "carousel-item"}>
      <div
        style={{
          borderRadius: "5%",
          boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
        }}
      >
        <div className="col-lg-6 shopbystyle">
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
          >
            {dotproduct?.name}
          </h4>
          {/* <br></br> */}
          <ReadMore>{dotproduct?.Description}</ReadMore>
        </div>
        <div
          onClick={() => navigate(`/customize-room-idea/${dotproduct?._id}`)}
        >
          <div className="col-lg-6 ImageContainer shopbyimagestyle">
            {/* {console.log("dot products ", dotproduct)} */}
            <img
              loading="lazy"
              src={`${REACT_APP_URL}/images/dotimage/${dotproduct?.dotProductImageIds[0]?.image}`}
              style={{
                width: "100%",
                maxHeight: "auto",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              }}
              alt={dotproduct?.name}
            />
            {dotproduct &&
              dotproduct?.dotProductImageIds.length > 0 &&
              dotproduct?.dotProductImageIds[0].dots?.map((p, i) => (
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
                    <Link
                      to={`/customized-product/${p?.productId?.Collection[0]?.url}/${p?.productId?.Urlhandle}`}
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
                    </Link>
                  </span>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
