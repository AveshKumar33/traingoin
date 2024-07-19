import { Link, useParams } from "react-router-dom";
import Footer from "../../../../components/footer/Footer";
import Header from "../../../../components/header/Header";
import { REACT_APP_URL, axiosInstance } from "../../../../config";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";

import { useEffect, useState } from "react";
import Preloader from "../../../../components/preloader/Preloader";
import { TablePagination } from "@mui/material";
import Modal from "../../../../components/modal/Modal";
import AddAttributePNG from "./AddAttributePNG";
import { FaImage } from "react-icons/fa";
import { toastError } from "../../../../utils/reactToastify";

const CombinationData = () => {
  const [AllCombination, setAllCombination] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Option, setOption] = useState("");
  const [IsModal, setIsModal] = useState(false);
  const [uploadImagePNG, setuploadImagePNG] = useState();
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");
  //   const [Name, setName] = useState();
  const { attName, attId, parameterName, parameterId, isVisibleInCustomized } =
    useParams();

  // parameter position image controller
  const fetchCombination = async () => {
    try {
      const { currentPage } = page;
      const startIndex = currentPage * rowsPerPage + 1;
      setIndex(startIndex);
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/combination/${attId}/${parameterId}?page=${
          currentPage + 1
        }&limit=${rowsPerPage}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      setAllCombination(data.data);
      setPage((prevState) => ({ ...prevState, totaltems: data.totalCount }));
      //   setName(data.data.Name);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  //   const handleDeleteItemPng = async (id) => {
  //     if (window.confirm("Are you Sure to Delete Item")) {
  //       try {
  //         const { data } = await axiosInstance.delete(
  //           `/api/attribute/deletePositionGroupImage/${attId}/${parameterId}/${id}`,
  //           {
  //             headers: {
  //               token: localStorage.getItem("token"),
  //             },
  //           }
  //         );
  //         if (data.success) {
  //           setuploadImagePNG("");
  //           let obj = {
  //             ...Option,
  //             Png: "",
  //           };
  //           setOption(obj);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  const handleDeleteItemPng = async (id) => {
    setuploadImagePNG("");
    let obj = {
      ...Option,
      pngImage: "",
    };
    setOption(obj);
  };

  const handleSubmitAttributeItemPng = async (id) => {
    try {
      if (!uploadImagePNG) {
        return toastError("Image is required");
      }

      let attributeItemdata = new FormData();
      attributeItemdata.append("pngImage", uploadImagePNG);

      const { data } = await axiosInstance.put(
        `/api/combination/${id}`,
        attributeItemdata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        fetchCombination();
        setIsModal(false);
        setuploadImagePNG("");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  };

  const closeModal = () => {
    setIsModal(false);
    setuploadImagePNG("");
  };
  useEffect(() => {
    fetchCombination();
  }, [page.currentPage, rowsPerPage, searchData]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  if (Loading) {
    return <Preloader />;
  }

  return (
    <>
      <Modal
        handleClose={closeModal}
        width="35%"
        show={IsModal}
        // height="65%"
      >
        <div style={{ padding: "2rem" }}>
          <h6>Upload Photo</h6>

          <AddAttributePNG
            option={Option}
            // id={id}
            closeModal={closeModal}
            setuploadImagePNG={setuploadImagePNG}
            uploadImagePNG={uploadImagePNG}
            handleDeleteItemPng={handleDeleteItemPng}
          />
        </div>

        <center>
          <button
            type="submit"
            className="btn btn-primary m-3"
            onClick={() => {
              handleSubmitAttributeItemPng(Option?._id);
            }}
          >
            Save
          </button>
        </center>
      </Modal>
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 ">
                <div className="white_card card_height_100 mb_30">
                  <div className="">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">
                          {`Positions Images`}{" "}
                          <i
                            className="fa fa-chevron-right"
                            style={{ fontSize: 10 }}
                          />{" "}
                          {`${parameterName}`}
                        </h3>
                      </div>
                    </div>
                    <p className="py-2">
                      <Link to={`/`} style={{ color: "#707087", fontSize: 16 }}>
                        <i className="fa-solid fa-house-user"></i>
                      </Link>{" "}
                      &nbsp;
                      {/* <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16 }}
                      />{" "} */}
                      <HomeIcon style={{ fontSize: 23 }} />
                      &nbsp;
                      <Link
                        style={{ fontSize: 16 }}
                        to={"/admin/attribute-new"}
                      >
                        Attribute
                      </Link>{" "}
                      &nbsp;
                      {/* <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16 }}
                      />{" "} */}
                      <ArrowForwardIosIcon style={{ fontSize: 16 }} />
                      <Link
                        style={{ fontSize: 16 }}
                        to={`/admin/attribute/parameters/${attName}/${attId}/${isVisibleInCustomized}`}
                      >
                        Parameter
                      </Link>{" "}
                      &nbsp;
                      {/* <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16 }}
                      />{" "} */}
                      <ArrowForwardIosIcon style={{ fontSize: 16 }} />
                      <Link style={{ fontSize: 16 }}>
                        Positions Images
                      </Link>{" "}
                      &nbsp;
                    </p>
                  </div>
                  <div className="">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            {/* <th scope="col">PNG</th> */}
                            <th scope="col">Name</th>
                            <th scope="col">PNG</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Upload
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {AllCombination &&
                            AllCombination.length > 0 &&
                            AllCombination.map((t, indx) => (
                              <tr key={t._id}>
                                <th scope="row">{index + indx}</th>
                                <td>
                                  <h5>
                                    Attribute:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {t?.attributeId?.Name}
                                    </span>
                                  </h5>
                                  <h5>
                                    Attribute Category:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {
                                        t?.parameterId?.attributeCategoryId
                                          ?.Name
                                      }
                                    </span>
                                  </h5>
                                  <h5>
                                    Parameter:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {t?.parameterId?.name}
                                    </span>
                                  </h5>
                                  <h5>
                                    Position:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {t?.positionId?.name}
                                    </span>
                                  </h5>
                                </td>
                                <td>
                                  <img
                                    src={`${REACT_APP_URL}/images/parameterPosition/${t.pngImage}`}
                                    style={{ width: "150px", height: "150px" }}
                                    alt="__parameterPositionImage"
                                  />{" "}
                                  &nbsp; &nbsp;
                                </td>

                                <td>
                                  <span>
                                    <div
                                      onClick={() => {
                                        setOption(t);
                                        setIsModal(true);
                                      }}
                                      style={{
                                        backgroundColor: "#d98926",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        float: "left",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <FaImage />
                                    </div>
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#1a2e45d7",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                      marginTop: "5px",
                    }}
                  >
                    <TablePagination
                      component="div"
                      className="text-white"
                      rowsPerPageOptions={[20, 25, 100, 200, 500]}
                      count={page.totaltems || 0}
                      rowsPerPage={rowsPerPage || 0}
                      page={page.currentPage || 0}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </section>
    </>
  );
};

// const AddAttributePNG = ({
//   option,
//   setuploadImagePNG,
//   uploadImagePNG,
//   handleDeleteItemPng,
// }) => {
//   const [isLoading, setisLoading] = useState(false);

//   return (
//     <>
//       {isLoading ? (
//         <AiOutlineLoading3Quarters />
//       ) : (
//         <div key={uploadImagePNG}>
//           {option.pngImage ? (
//             <>
//               <div className="image-area">
//                 <img
//                   loading="lazy"
//                   src={`${
//                     REACT_APP_URL
//                   }/images/parameterPosition/${option.pngImage}`}
//                   alt="Preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />

//                 <button
//                   className="AttributeImageRemove-image"
//                   type="button"
//                   style={{ display: "inline" }}
//                 >
//                   <i
//                     className="fa-solid fa-trash"
//                     onClick={() => handleDeleteItemPng(option?._id)}
//                     style={{ padding: "5px" }}
//                   ></i>
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <label htmlFor="FileDisplay" className="PlusBox">
//                 <div className="image-area">
//                   {!uploadImagePNG ? (
//                     <>
//                       <img
//                         loading="lazy"
//                         src={UploadImage}
//                         alt="Preview"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           border: "1px solid #ddd",
//                         }}
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <img
//                         loading="lazy"
//                         src={URL.createObjectURL(uploadImagePNG)}
//                         alt="Preview"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           border: "1px solid #ddd",
//                         }}
//                       />
//                     </>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   id="FileDisplay"
//                   name="parameterPosition"
//                   onChange={(e) => setuploadImagePNG(e.target.files[0])}
//                 />
//               </label>
//             </>
//           )}
//           <h4>PNG</h4>
//         </div>
//       )}
//     </>
//   );
// };

export default CombinationData;
