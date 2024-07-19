import React from "react";
import { Link } from "react-router-dom";
import "../../../roomideas/RoomIdea.css";
import { REACT_APP_URL } from "../../../../../config";
import ReadMore from "../../../../../components/ReadMore/ReadMore";

export const DotProductModalCard = ({ product }) => {
  return (
    <div
      className={`col-lg-4`}
      style={{
        float: "left",
        marginRight: "5px",
        paddingRight: "0px",
        paddingLeft: "0px",
        width: "33.2vw",
        marginTop: "5px",
      }}
    >
      <div className="ProductCardHover">
        <center>
          <Link to={`/customize-room-idea/${product?.dotProductId?._id}`}>
            <div>
              <div
                className="ImageContainer"
                style={{ position: "relative", display: "inline-block" }}
              >
                {/* <h4
            style={{
              color: "#475B52",
              letterSpacing: "1px",
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "21px",
            }}
          >
            {product?.dotProductId?.name}
          </h4> */}
              </div>
              <div
                className="ImageContainer"
                style={{ position: "relative", display: "inline-block" }}
              >
                <div>
                  <img
                    loading="lazy"
                    src={`${REACT_APP_URL}/images/dotimage/${product?.image}`}
                    className="card-img-top RoomIdeaImageStyle"
                    style={{
                      height: "65vh",
                      width: "33.2vw",
                    }}
                    alt={product?.dotProductId?.name}
                  />
                </div>
                {product &&
                  product?.dots.length > 0 &&
                  product?.dots?.map((p, i) => (
                    <React.Fragment key={i}>
                      <div
                        className="Dot fa fa-circle text-danger-glow blink"
                        key={p._id}
                        style={{
                          left: `${p.positionX}%`,
                          top: `${p.positionY}%`,
                        }}
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

              <div style={{ padding: "10px" }}>
                <h6
                  style={{
                    textDecoration: "none",
                    color: "#463D36",
                    textAlign: "center",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  {product?.dotProductId?.name}
                </h6>
              </div>
            </div>
          </Link>
        </center>
      </div>
    </div>
  );
};
