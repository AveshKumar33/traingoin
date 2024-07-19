import React from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import carousalone from "../../assets/Image/sec5.jpg";

const Testimonial = () => {
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
      <div className="row">
        <div className="col-sm-12">
          <div id="GallerySlider" className="owl-carousel">
            <Carousel
              responsive={responsive}
              itemclassName="p-0 m-0"
              infinite={true}
              autoPlaySpeed={1000}
            >
              <div className="item zoomeffect">
                <div className="shadow-effect">
                  <img
                     loading="lazy"
                    className="img-responsive"
                    src={carousalone}
                    style={{height:"40vh"}}
                    alt=""
                  />
                  <div
                    className="item-details"
                    style={{textAlign:"center",backgroundColor:"#fff",padding:"20px"}}
                  >
                    <h5>Name Here</h5>
                  </div>
                </div>
              </div>
              <div className="item zoomeffect">
                <div className="shadow-effect">
                  <img
                      loading="lazy"
                    className="img-responsive"
                    src={carousalone}
                    style={{height:"40vh"}}
                    alt=""
                  />
                  <div
                    className="item-details"
                    style={{textAlign:"center",backgroundColor:"#fff",padding:"20px"}}
                  >
                    <h5>Name Here</h5>
                  </div>
                </div>
              </div>
              <div className="item zoomeffect">
                <div className="shadow-effect">
                  <img
                      loading="lazy"
                    className="img-responsive"
                    src={carousalone}
                    style={{height:"40vh"}}
                    alt=""
                  />
                  <div
                    className="item-details"
                    style={{textAlign:"center",backgroundColor:"#fff",padding:"20px"}}
                  >
                    <h5>Name Here</h5>
                  </div>
                </div>
              </div>
              <div className="item zoomeffect">
                <div className="shadow-effect">
                  <img
                      loading="lazy"
                    className="img-responsive"
                    src={carousalone}
                    style={{height:"40vh"}}
                    alt=""
                  />
                  <div
                    className="item-details"
                    style={{textAlign:"center",backgroundColor:"#fff",padding:"20px"}}
                  >
                    <h5>Name Here</h5>
                  </div>
                </div>
              </div>
              <div className="item zoomeffect">
                <div className="shadow-effect">
                  <img
                      loading="lazy"
                    className="img-responsive"
                    src={carousalone}
                    style={{height:"40vh"}}
                    alt=""
                  />
                  <div
                    className="item-details"
                    style={{textAlign:"center",backgroundColor:"#fff",padding:"20px"}}
                  >
                    <h5>Name Here</h5>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
