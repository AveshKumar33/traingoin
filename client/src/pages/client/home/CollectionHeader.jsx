import React from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "./clienttestimonial.css";
import { REACT_APP_URL } from "../../../config";

const CollectionHeader = ({ reviewdata = [] }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 60,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      paritialVisibilityGutter: 50,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };

  return (
    <>
      <section className="testimonials">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div id="customers-testimonials" className="owl-carousel">
                {/*TESTIMONIAL 1 */}
                <Carousel
                  responsive={responsive}
                  itemClass="px-3"
                  infinite={true}
                  autoPlaySpeed={1000}
                >
                  {reviewdata &&
                    reviewdata?.length > 0 &&
                    reviewdata?.map((item) => {
                      return (
                        <>
                          <CarousalItem item={item} />
                        </>
                      );
                    })}

                  {/*END OF TESTIMONIAL 5 */}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const CarousalItem = ({ item }) => {
  return (
    <>
      {/* <div className="item">
        <div className="shadow-effect">
          <div
            className="item-details"
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              border: "1px solid #475B52",
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: 30,
            }}
          >
            <div className="col-4" style={{ float: "left" }}>
              <img
                className="img-responsive"
                src={`${REACT_APP_URL}/images/review/${
                  item.ReviewPicture
                }`}
                alt=""
                style={{ borderRadius: "50%", width: 70 }}
              />
            </div>
            <div className="col-8" style={{ float: "left" }}>
              <h5 style={{ color: "#324040" }}>{item.Name}</h5>
              {[...new Array(5)].map((i, index) => {
                return index < item.Rating ? (
                  <i className="fas fa-star" style={{ color: "#FFB400" }}></i>
                ) : (
                  <i className="far fa-star" style={{ color: "#000" }}></i>
                );
              })}
            </div>
            <br />
            <br />
            <br />
            <br />
            <p
              style={{
                color: "#324040",
                backgroundColor: "#475B52",
                padding: 20,
                borderRadius: 10,
              }}
            >
              {item.ReviewBody}
            </p>
          </div>
        </div>
      </div> */}

      <div className="item">
        <div className="shadow-effect">
          <div
            className="item-details"
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              border: "1px solid #475B52",
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: 30,
            }}
          >
            <div className="col-4" style={{ float: "left" }}>
              <img
                loading="lazy"
                className="img-responsive"
                src={`${REACT_APP_URL}/images/review/${item?.ReviewPicture}`}
                alt=""
                style={{ borderRadius: "50%", width: 70 }}
              />
            </div>
            <div className="col-8" style={{ float: "left" }}>
              <span style={{ color: "#324040", fontSize: 18, fontWeight: 800 }}>
                {item?.Name}
              </span>
              <br></br>
              <span style={{ color: "#ddd", fontSize: 14, fontWeight: 800 }}>
                {item?.Email}
              </span>
            </div>
            <br />
            <br />
            <br />
            <br />
            <p
              style={{
                color: "#324040",
                backgroundColor: "#F8F8F8",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <span style={{ color: "#000", fontSize: 14, fontWeight: 800 }}>
                {item?.ReviewTitle}
              </span>
              <br />
              {item?.ReviewBody}
            </p>
            {[...new Array(5)].map((i, index) => {
              return index < item?.Rating ? (
                <i className="fas fa-star" style={{ color: "#FFB400" }}></i>
              ) : (
                <i className="far fa-star" style={{ color: "#000" }}></i>
              );
            })}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style={{
                color: "#ddd",
                fontSize: 14,
                fontWeight: 800,
                textAlign: "right",
              }}
            >
              {item?.createdAt.slice(0, 10).split("-").reverse().join("-")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionHeader;
