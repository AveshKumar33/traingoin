import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";

const Experienceslider = ({ slider, video = "", type = "" }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const allData = [...slider, video];
  return (
    <div className="row">
      <div className="col-sm-12">
        <div id="customers-testimonials" className="owl-carousel">
          <Slider {...settings}>
            {allData.map((item, index) => (
              <CarousalItem key={index} item={item} type={type} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const CarousalItem = ({ item, type }) => {
  return (
    <div className="shadow-effect">
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            borderRadius: "10px",
          }}
        >
          {item.includes("https://www.youtube.com") ? (
            <iframe
            style={{width:"31vw", height:"65vh", borderRadius: "10px",}}
              src={item}
              title="YouTube video player"
              frameBorder="5"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              className="img-fluid"
              loading="lazy"
              src={`${REACT_APP_URL}/images/${type}/${item}`}
              alt=""
              style={{
                width: "31vw",
                height: "65vh",
                borderRadius: "10px",
              }}
            />
          )}
          <div
            className="gradient-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
              borderRadius: "10px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Experienceslider;
