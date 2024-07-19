import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useDispatch, useSelector } from "react-redux";
import { fetchprojectDetails } from "../../../redux/slices/projectSlice";
import { Link, useParams } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
// import ReactHtmlParser from "react-html-parser";
import { MdHeight } from "react-icons/md";
import ProductCard from "../../../components/productcard/ProductCard";
import { AiTwotoneHeart } from "react-icons/ai";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { BsFillCartFill } from "react-icons/bs";
import DotProductCard from "../roomideas/DotProductCard";
import DotCustomizeProductCard from "../roomideas/DotCustomizeProductCard";

import SingleProductCombinations from "./SingleProductCombinations";
import CustomizeProductCombination from "./CustomizeProductCombination";
import { toastError } from "../../../utils/reactToastify";

const ProjectDetails = () => {
  const { id } = useParams();
  const { loading, projectdetails } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ProjectDetails`
      );
      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  useEffect(() => {
    dispatch(fetchprojectDetails(id));
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      >
        {/* <h3
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "150px",
            textTransform: "uppercase",
          }}
        >
          {projectdetails?.ProjectName}
        </h3> */}
        <center>
          <span
            className="bg-white rounded"
            style={{ padding: "5px 20px", marginTop: "20px" }}
          >
            {projectdetails?.ProjectCategory?.Name}{" "}
          </span>
        </center>
      </div>
      <div className="row">
        <div className="container-fluid" style={{ marginBottom: "10px" }}>
          {/* <div style={{ backgroundColor: "#e0a45a" }}>
            <div className="p-5">
              <h3 className="text-white">{projectdetails?.ProjectName} </h3>
              <h6>
                <span className="bg-white p-1 rounded">
                  {projectdetails?.ProjectCategory?.Name}{" "}
                </span>
              </h6>
            </div>
          </div> */}

          <br></br>

          <div className="container-fluid">
            <div className="col-md-12" style={{ float: "left" }}>
              <h4
                className="text-center mb-3"
                style={{ fontWeight: "600", textTransform: "uppercase" }}
              >
                {" "}
                {projectdetails?.ProjectName}
              </h4>
              <center>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    width: "80%",
                    fontSize: "16px",
                  }}
                >
                  {projectdetails?.ProjectDescription?.replace(
                    /<\/?(p|br|span)(\/)?>/g,
                    (match) => (match === "<br>" ? " " : "")
                  )
                    .replace(/<\/?p>/g, "")
                    .replace(/<span[^>]*>/g, "")
                    .replace(/<\/span>/g, "")
                    .replace(/<strong[^>]*>/g, "")
                    .replace(/<\/strong>/g, "")
                    .slice(0, 150)
                    .replaceAll()}
                </p>
              </center>
              {projectdetails?.ProjectImage?.length > 0 && (
                <>
                  {/* <h4 className="text-center my-5">Project Images</h4> */}

                  {/* <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      justifyContent: "space-between",
                      // alignItems: "center",
                    }}
                  > */}
                  <br></br>
                  {projectdetails?.ProjectImage?.map((img) => {
                    return (
                      <>
                        <ProjectImages key={img} img={img} />
                      </>
                    );
                  })}
                  {/* </div> */}
                </>
              )}

              {projectdetails?.video && projectdetails?.video.length > 0 && (
                <>
                  {/* <h2 className="text-center my-3">Project Video</h2> */}
                  <iframe
                    width="100%"
                    height="400"
                    src={projectdetails?.video}
                    title="YouTube video player"
                    frameBorder="5"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  <br></br>
                  <br></br>
                  {/* <ProjectVideo video={projectdetails.video} /> */}
                </>
              )}
            </div>
            <br></br>
            <br></br>
            <div className="col-md-12" style={{ float: "left" }}>
              <div
                className="row"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  marginRight: "-17px",
                  marginLeft: "-25px",
                }}
              >
                <h2
                  className="text-center mb-3"
                  style={{ fontWeight: "600", textTransform: "uppercase" }}
                >
                  Product Used
                </h2>
                {/**single  product */}
                {projectdetails?.singleProducts &&
                  projectdetails?.singleProducts.length > 0 && (
                    // <div className="col-lg-6" style={{ float: "left" }}>
                    <>
                      {projectdetails?.singleProducts &&
                        projectdetails?.singleProducts.length > 0 &&
                        projectdetails?.singleProducts.map((p) => (
                          <>
                            {/* <div className="row"> */}
                            <SingleProductCombinations
                              key={p._id}
                              productId={p._id}
                              collectionUrl={p.Collection[0].url}
                            />
                            {/* </div> */}
                          </>
                        ))}
                    </>
                    // </div>
                  )}
                {/**CUSTOMIZE  product */}
                {projectdetails?.customizedProduct &&
                  projectdetails?.customizedProduct.length > 0 && (
                    // <div className="col-lg-6" style={{ float: "left" }}>
                    <>
                      {projectdetails?.customizedProduct &&
                        projectdetails?.customizedProduct.length > 0 &&
                        projectdetails?.customizedProduct.map((p) => (
                          <>
                            {/* <div className="row"> */}
                            <CustomizeProductCombination
                              key={p._id}
                              productId={p._id}
                              collectionUrl={p.Collection[0].url}
                            />
                            {/* </div> */}
                          </>
                        ))}
                      {/* </div> */}
                    </>
                  )}
                {/**single dot product */}
                {projectdetails?.dotSingleProduct &&
                  projectdetails?.dotSingleProduct.length > 0 && (
                    // <div
                    //   className="col-lg-6"
                    //   style={{ float: "left", marginTop: "20px" }}
                    // >
                    <>
                      {projectdetails?.dotSingleProduct &&
                        projectdetails?.dotSingleProduct.length > 0 &&
                        projectdetails?.dotSingleProduct.map((p) => (
                          <>
                            {/* <div className="row"> */}
                            <DotProductCard key={p._id} dotproduct={p} />
                            {/* </div> */}
                          </>
                        ))}
                      {/* </div> */}
                    </>
                  )}
                {/**single dot product */}
                {projectdetails?.customizeDotProduct &&
                  projectdetails?.customizeDotProduct.length > 0 && (
                    // <div
                    //   className="col-lg-6"
                    //   style={{ float: "left", marginTop: "20px" }}
                    // >
                    <>
                      {projectdetails?.customizeDotProduct &&
                        projectdetails?.customizeDotProduct.length > 0 &&
                        projectdetails?.customizeDotProduct.map((p) => (
                          <>
                            {/* <div className="row"> */}
                            <DotCustomizeProductCard
                              key={p._id}
                              dotproduct={p}
                            />
                            {/* </div> */}
                          </>
                        ))}
                      {/* </div> */}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MainFooter />
    </>
  );
};

const ProjectImages = ({ img }) => {
  return (
    <>
      <div className="col-lg-3" style={{ float: "left" }}>
        <center>
          <div className="col-lg-11">
            <img
              loading="lazy"
              src={`${REACT_APP_URL}/images/project/${img}`}
              alt=""
              style={{
                flex: "0 0 48%",
                marginBottom: "25px",
                width: "100%",
                height: "40vh",
              }}
            />
          </div>
        </center>
      </div>
    </>
  );
};

// const ProjectVideo = ({ video }) => {
//   return (
//     <>
//       <div className="mt-3">
//         {video && (
//           <iframe
//             width="500"
//             height="500"
//             src={video}
//             title="YouTube video player"
//             frameBorder="5"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//           ></iframe>
//         )}
//       </div>
//     </>
//   );
// };

// const ProductUsed = ({ products }) => {
//   return (
//     <>
//       {/* <div className="row">
//         <div className="col-md-3">
//           <img
//                loading="lazy" src="http://3.108.31.154/images/product/productimg-1695032071216.webp"
//             alt=""
//             className="img-fluid"
//           />

//           <Link to={`/`}>
//             <h6 className="">Black Modern Square Coffee jksdsa</h6>
//           </Link>

//           <div className="d-flex justify-content-between">
//             <h2
//               style={{
//                 fontSize: 16,
//                 color: "#463D36",
//               }}
//             >
//               ₹ 600000
//             </h2>
//             <strike>₹ 500000</strike>
//             <AiTwotoneHeart size={22} color="#463D36" />
//           </div>

//           <h6 className="text-start">Save ₹ 10000 (14.29%)</h6>
//         </div>
//         <div className="col-md-3">
//           <img
//                loading="lazy" src="http://3.108.31.154/images/product/productimg-1695032071216.webp"
//             alt=""
//             className="img-fluid"
//           />

//           <Link to={`/`}>
//             <h6 className="">Black Modern Square Coffee jksdsa</h6>
//           </Link>

//           <div className="d-flex justify-content-between">
//             <h2
//               style={{
//                 fontSize: 16,
//                 color: "#463D36",
//               }}
//             >
//               ₹ 600000
//             </h2>
//             <strike>₹ 500000</strike>
//             <AiTwotoneHeart size={22} color="#463D36" />
//           </div>

//           <h6 className="text-start">Save ₹ 10000 (14.29%)</h6>
//         </div>
//         <div className="col-md-3">
//           <img
//                loading="lazy" src="http://3.108.31.154/images/product/productimg-1695032071216.webp"
//             alt=""
//             className="img-fluid"
//           />

//           <Link to={`/`}>
//             <h6 className="">Black Modern Square Coffee jksdsa</h6>
//           </Link>

//           <div className="d-flex justify-content-between">
//             <h2
//               style={{
//                 fontSize: 16,
//                 color: "#463D36",
//               }}
//             >
//               ₹ 600000
//             </h2>
//             <strike>₹ 500000</strike>
//             <AiTwotoneHeart size={22} color="#463D36" />
//           </div>

//           <h6 className="text-start">Save ₹ 10000 (14.29%)</h6>
//         </div>
//         <div className="col-md-3">
//           <img
//                loading="lazy" src="http://3.108.31.154/images/product/productimg-1695032071216.webp"
//             alt=""
//             className="img-fluid"
//           />

//           <Link to={`/`}>
//             <h6 className="">Black Modern Square Coffee jksdsa</h6>
//           </Link>

//           <div className="d-flex justify-content-between">
//             <h2
//               style={{
//                 fontSize: 16,
//                 color: "#463D36",
//               }}
//             >
//               ₹ 600000
//             </h2>
//             <strike>₹ 500000</strike>
//             <AiTwotoneHeart size={22} color="#463D36" />
//           </div>

//           <h6 className="text-start">Save ₹ 10000 (14.29%)</h6>
//         </div>
//       </div> */}

//       {products &&
//         products.map((p) => (
// <ProductCard key={p._id} product={p} colnumber={6} />
//         ))}
//     </>
//   );
// };

export default ProjectDetails;
