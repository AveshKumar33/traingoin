import React from "react";
import { Link } from "react-router-dom";
import SliderImg1 from "../../assets/Image/Slider11.jpg";
import { REACT_APP_URL } from "../../config";

const ProjectCard = ({ Name, image, id }) => {
  return (
    <>
      <div
        className="col-lg-6 d-flex justify-content-end"
        style={{ paddingRight: "0px", paddingLeft:"5px", marginTop: "10px" }}
      >
        <div
          className="col-lg-11 custom-col completedprojectsheading"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/project/${image})`,
            height: "80vh",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          <center>
          <Link to={`/project/${id}`}>
            <h4>{Name}</h4>
          </Link>
          </center>
        </div>
      </div>
      {/* <div
        className="col-lg-3 col-md-6 col-sm-12 choosesectionstyle"
        style={{
          height: "80vh",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)),url(${REACT_APP_URL}/images/project/${image})`,
        }}
      >
        <Link to={`/project/${id}`}>
          <div className="overlay">
            <div style={{ position: "relative", top: "85%", zIndex: 2 }}>
              <center>
                <h3 className="ChoosesectionHeading">{Name}</h3>
              </center>
            </div>
          </div>
        </Link>
      </div> */}
    </>
  );
};

export default ProjectCard;
