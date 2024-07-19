import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";

const CatalogueSlider = ({ slider, type = "" }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000, //
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div id="customers-testimonials" className="owl-carousel">
          {slider.length === 1 ? (
            <CarousalItem image={slider[0].ImageName} type={type} />
          ) : (
            <Slider {...settings}>
              {slider.map((item, index) => (
                <CarousalItem key={index} image={item.ImageName} type={type} />
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

const CarousalItem = ({ image }) => {
  return (
    <div className="shadow-effect">
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            className="img-fluid HomeCarouselImageSectionHeight"
            loading="lazy"
            src={`${REACT_APP_URL}/images/slider/${image}`}
            alt=""
            style={{
              width: "100vw",
            }}
          />
          <div
            className="gradient-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5))",
            }}
          ></div>
          <div
            className="content-overlay"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              zIndex: 1,
            }}
          >
            {/* Aapka content yahaan */}
            <h1 className="HeaderHeading">Welcome To The Railingo</h1>
            <p
              style={{
                color: "#fff",
                fontSize: "18px",
                fontFamily: "Macondo, cursive",
                marginBottom: "30px",
              }}
            >
              The Art of Designing and Crafting Exclusive Pieces
            </p>
            <a
              href="#SecondSection"
              style={{
                borderRadius: "10px",
                padding: "10px 20px 10px 20px",
                backgroundColor: "#fff",
                color: "#475B52",
                letterSpacing: "1px",
                fontWeight: "600",
                textTransform: "uppercase",
                zoom: "80%",
              }}
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueSlider;
