import React from "react";
import { Link } from "react-router-dom";
// import Carousel from "../../../UI/Carousel";
import { REACT_APP_URL } from "../../../config";
import "..//roomideas/RoomIdea.css";

const DotProductCard = ({ removeProduct, dotproduct }) => {
  return (
    <>
      <div
        className={`col-lg-6`}
        style={{ borderRadius: "10px", float: "left" }}
      >
        <div className="ProductCardHover">
          <center>
            <Link
              to={`/room-idea/${dotproduct._id}`}
              style={{ marginBottom: "0px" }}
            >
              <div>
                <div
                  className="ImageContainer"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <div>
                    {dotproduct?.dotProductImageIds[0] &&
                      dotproduct?.dotProductImageIds[0]?.video && (
                        <iframe
                          className="card-img-top RoomIdeaImageStyle"
                          src={dotproduct?.dotProductImageIds[0]?.video}
                          title={dotproduct?.name}
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        />
                      )}
                    {dotproduct?.dotProductImageIds[0]?.image && (
                      <img
                        loading="lazy"
                        src={`${REACT_APP_URL}/images/dotimage/${dotproduct?.dotProductImageIds[0]?.image}`}
                        className="card-img-top RoomIdeaImageStyle"
                        alt={dotproduct?.name}
                      />
                    )}
                  </div>
                  {dotproduct?.dotProductImageIds[0]?.dots?.map((p, i) => {
                    return (
                      <React.Fragment key={p._id}>
                        <div
                          className="Dot fa fa-circle text-danger-glow blink"
                          key={p._id}
                          // onClick={() => handleModal(i, p.productId)}
                          style={{
                            left: `${p.positionX}%`,
                            top: `${p.positionY}%`,
                          }}
                        ></div>
                        {/*  ed */}
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
                          }}
                        >
                          <Link
                            to={`/product/${p?.productId?.Collection[0]?.url}/${p?.productId?.Urlhandle}`}
                          >
                            <p style={{ color: "#fff" }}>
                              {p?.productId?.ProductName.slice(0, 10)}
                            </p>
                          </Link>
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <br></br>
            </Link>
            <Link to={`/room-idea/${dotproduct._id}`}>
              <p className="create-Rating-button cursor-pointer">
                {" "}
                {dotproduct?.name}
              </p>
            </Link>

            {removeProduct && (
              <>
                <button
                  onClick={() => removeProduct(dotproduct?._id)}
                  className="btn btn-primary"
                >
                  Remove Product
                </button>
              </>
            )}
          </center>
        </div>
      </div>
    </>
  );
};

export default DotProductCard;
