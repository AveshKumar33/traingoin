import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";
import ImageModel from "../Exibhitions/ImageModel";

const AboutUsSlider = ({ slider, type = "" }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const settings = {
    dots: false,
    infinite: slider.length > 1 ? true : false,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  function handleOpen(src) {
    setSelectedImage(src);
  }
  const closeModel = () => {
    setSelectedImage(null);
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div id="customers-testimonials" className="owl-carousel">
          <Slider {...settings}>
            {slider.map((image, index) => (
              <div key={index}>
                <div
                  style={{
                    border: "1px solid #eee",
                    textAlign: "center",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    margin: "10px",
                    backgroundColor: "#fff",
                  }}
                >
                  <img
                    src={`${REACT_APP_URL}/images/${type}/${image}`}
                    style={{
                      height: "45vh",
                      width: "100%",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                    }}
                    alt="Review Image"
                    onClick={() =>
                      handleOpen(`${REACT_APP_URL}/images/${type}/${image}`)
                    }
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        {selectedImage && (
          <ImageModel selectedImage={selectedImage} closeModel={closeModel} />
        )}
      </div>
    </div>
  );
};

// const CarousalItem = ({ image, type }) => {
//   return (
//     <div className="shadow-effect">
//       <div
//         style={{
//           textAlign: "center",
//           // backgroundColor: "#fff",
//           borderRadius: "10px",
//         }}
//       >
//         <div
//           style={{
//             position: "relative",
//             display: "inline-block",
//             borderRadius: "10px",
//           }}
//         >
//           {console.log("typetype", type)}
//           <img
//             className="img-fluid"
//             loading="lazy"
//             src={`${REACT_APP_URL}/images/${type}/${image}`}
//             alt=""
//             style={{
//               width: "100%",
//               // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
//               height: "50vh",
//               borderRadius: "10px",
//             }}
//           />
//           <div
//             className="gradient-overlay"
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               background:
//                 "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
//               borderRadius: "10px",
//             }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default AboutUsSlider;
