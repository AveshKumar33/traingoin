import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";
import { Link } from "react-router-dom";

const ProjectSlider = ({ id, project, type = "" }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 3000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="col-lg-6" style={{ float: "left" }}>
      <div className="col-lg-12">
        <div id="customers-testimonials" className="owl-carousel">
          <Slider {...settings}>
            {project?.ProjectImage &&
              project?.ProjectImage.length > 0 &&
              project?.ProjectImage.map((item, index) => (
                <CarousalItem
                  key={index}
                  project={project}
                  image={item}
                  Name={project?.ProjectName}
                  id={id}
                />
              ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const CarousalItem = ({ project, image, Name, id }) => {
  return (
    <div
      className="col-lg-12 justify-content-end"
      style={{
        paddingRight: "0px",
        paddingLeft: "5px",
        marginTop: "0px",
      }}
    >
      <div
        className="col-lg-11 custom-col completedprojectsheading completedprojectimage"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/project/${image})`,
          
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          position: "relative", // Ensure positioning relative for absolute positioning of content
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "70%",
            transform: "translateX(-50%)",
            color: "white",
            width: "100%",
          }}
        >
          <Link to={`/project/${id}`}>
            <h4>{Name}</h4>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlider;
