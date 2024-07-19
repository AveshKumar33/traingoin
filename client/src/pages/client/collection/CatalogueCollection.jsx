import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";

const CatalogueCollection = ({ productImages, type = "" }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000, //
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="row" style={{padding:"0px"}}>
      <div className="col-sm-12">
        <div id="customers-testimonials" className="owl-carousel">
          <Slider {...settings}>
            {productImages &&
              productImages.map((item, index) => (
                <CarousalItem key={index} image={item} type={type} />
              ))}
          </Slider>
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
            className="img-fluid"
            loading="lazy"
            src={`${REACT_APP_URL}/images/collection/${image}`}
            alt=""
            style={{ height: "auto", width: "600px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogueCollection;
