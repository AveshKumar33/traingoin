import React from "react";

const TopBanner = ({ name, img, mobimg }) => {
  return (
    <>
      {/* {
      name !== "About Us" ?<> <section class="product_banner d-flex justify-content-center align-items-center " style={{backgroundImage:`url(${img})`}}  ><h1 className='text-white'><b>{name}</b></h1></section></>:<> <section class="product_banner d-flex justify-content-center align-items-center " style={{backgroundImage:`url(${require("../../../assests/about/aboutbanner.jpeg")})`}}  ><h1 className='text-white'><b>{name}</b></h1></section></>
    } */}

      <section
        class="product_banner d-flex justify-content-center align-items-center "
        style={{
          // backgroundImage: `linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.9)),url(${img})`,
          backgroundImage: `url(${img})`,
        }}
      >
        <h1 className="text-white text-center">
          <b>{name}</b>
        </h1>
      </section>
      <section
        class=" d-flex justify-content-center align-items-center d-lg-none d-block"
        style={{
          // backgroundImage: `linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.9)),url(${mobimg})`,
          backgroundImage: `url(${mobimg})`,
          backgroundSize: "cover",
          marginTop: "91px",
          height: "75vh",
        }}
      >
        <h1 className="text-white text-center">
          <b>{name}</b>
        </h1>
      </section>
    </>
  );
};

export default TopBanner;
