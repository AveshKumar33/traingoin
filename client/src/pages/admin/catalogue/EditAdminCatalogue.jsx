import { useEffect, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCatalogue,
  fetchCatalogueDetails,
} from "../../../redux/slices/catalogueSlice";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EditCatalogue = () => {
  const { id } = useParams();
  const { loading, Cataloguedetails } = useSelector((state) => state.catalogue);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [catalogueImage, setCatalogueImage] = useState({
    catalogueimg: "",
    preview: "",
  });
  const [cataloguePDF, setCataloguePDF] = useState({
    cataloguepdf: "",
    preview: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    pdfUrl: "",
    status: null,
  });

  const { name, status } = formData;

  useEffect(() => {
    dispatch(fetchCatalogueDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && Cataloguedetails) {
      const { image, pdfUrl, ...catalogue } = Cataloguedetails;
      setFormData(catalogue);
      setCatalogueImage((prevState) => ({
        ...prevState,
        catalogueimg: image,
      }));
      setCataloguePDF((prevState) => ({
        ...prevState,
        cataloguepdf: pdfUrl,
      }));
    }
  }, [loading, Cataloguedetails]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let catalogueData = new FormData();
    catalogueData.append("name", name);
    catalogueData.append("catalogueimg", catalogueImage.catalogueimg);
    catalogueData.append("cataloguepdf", cataloguePDF.cataloguepdf);
    catalogueData.append("status", status);
    const updateddata = {
      id,
      catalogueData,
    };

    dispatch(updateCatalogue(updateddata));
    navigate("/admin/catalogue");
  };

  return (
    <>
      <SideBar />
      <section className="">
        <TopHeader />
        <div className="main_content_iner ">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="col-lg-12" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">catalogue</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Name
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Name"
                                name="name"
                                value={name || ""}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Status
                              </label>
                              <select
                                id="FeaturedProducts"
                                className="form-control"
                                name="status"
                                required
                                value={status || 0}
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="image"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setCatalogueImage({
                                      catalogueimg: e.target.files[0],
                                      preview: URL.createObjectURL(
                                        e.target.files[0]
                                      ),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected images are not of valid type or size!"
                                    );
                                  }
                                }}
                              />
                              {catalogueImage?.catalogueimg &&
                                catalogueImage?.preview === "" && (
                                  <img
                                    style={{ width: "100px", height: "100px" }}
                                    src={`${REACT_APP_URL}/images/catalogue/${catalogueImage?.catalogueimg}`}
                                    alt="_profile"
                                  />
                                )}
                              {catalogueImage?.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={catalogueImage?.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
                            {/**pdf logic */}
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="PDFFile">
                                PDF File
                              </label>
                              <input
                                type="file"
                                accept=".pdf"
                                className="form-control"
                                id="PDFFile"
                                placeholder="PDF File"
                                name="PDFFile"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (
                                    file.type === "application/pdf" &&
                                    file.size <= 10000000
                                  ) {
                                    setCataloguePDF({
                                      cataloguepdf: e.target.files[0],
                                      preview: URL.createObjectURL(
                                        e.target.files[0]
                                      ),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected file is not a valid PDF or exceeds the size limit!"
                                    );
                                  }
                                }}
                              />

                              {cataloguePDF?.cataloguepdf &&
                                cataloguePDF?.preview === "" && (
                                  <a
                                    href={`${REACT_APP_URL}/images/catalogue/${cataloguePDF?.cataloguepdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View PDF
                                  </a>
                                )}
                              {cataloguePDF?.preview && (
                                <object
                                  data={cataloguePDF.preview}
                                  type="application/pdf"
                                  width="350"
                                  height="250"
                                >
                                  <p>
                                    This browser does not support PDFs. Please
                                    download the PDF to view it:{" "}
                                    <a href={cataloguePDF.preview} download>
                                      Download PDF
                                    </a>
                                  </p>
                                </object>
                              )}
                            </div>
                          </div>
                          <center>
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          </center>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer_iner text-center">
                  <p>
                    Designed &amp; Developed By{" "}
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditCatalogue;
