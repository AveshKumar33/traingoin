import React from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "./roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";

const RoomCatalogueCusProd = ({ productImages, type = "" }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
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
      {/* <div className="row">
        <div className="col-sm-12">
          <div id="customers-testimonials" className="owl-carousel">
            

            <Carousel
              responsive={responsive}
              itemClass="px-3"
              infinite={true}
              autoPlaySpeed={1000}
            >
              
              {productImages &&
                productImages?.length > 0 &&
                productImages?.map((item, index) => {
                  return <CarousalItem key={index} image={item} type={type} />;
                })}

            </Carousel>
          </div>
        </div>
      </div> */}

      <div
        className="col-lg-2"
        style={{ float: "left", height: "80vh", overflowY: "scroll" }}
      >
        <img
          src={SliderImg1}
          alt="_roomCatalogue"
          style={{ width: "100%", height: "15vh" }}
        ></img>
        <img
          src={SliderImg1}
          alt="_roomCatalogue"
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          alt="_roomCatalogue"
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          alt="_roomCatalogue"
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          alt="_roomCatalogue"
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
      </div>
      <div className="col-lg-10" style={{ float: "left", marginTop: "-7px" }}>
        <Carousel
          responsive={responsive}
          itemClass="px-3"
          infinite={true}
          autoPlaySpeed={1000}
        >
          {productImages &&
            productImages?.length > 0 &&
            productImages?.map((item, index) => {
              return <CarousalItem key={index} image={item} type={type} />;
            })}
        </Carousel>
      </div>
    </>
  );
};

const CarousalItem = ({ image }) => {
  return (
    <>
      <div className="shadow-effect">
        <div
          // className="item-details"
          style={{
            // boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            // border: "1px solid #475B52",
            // borderRadius: 10,
            backgroundColor: "#fff",
            // padding: 30,
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              className="img-fluid"
              loading="lazy"
              src={`${REACT_APP_URL}/images/product/${image}`}
              style={{ height: "500px", width: "100%" }}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomCatalogueCusProd;
