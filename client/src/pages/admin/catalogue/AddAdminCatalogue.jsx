import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { createCatalogue } from "../../../redux/slices/catalogueSlice";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddUser = () => {
  const { loading } = useSelector((state) => state.catalogue);
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
    status: 1,
  });

  const { name, status } = formData;

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let catalogueData = new FormData();
    catalogueData.append("name", name);
    catalogueData.append("catalogueimg", catalogueImage.catalogueimg);
    catalogueData.append("cataloguepdf", cataloguePDF.cataloguepdf);
    catalogueData.append("status", status);

    dispatch(createCatalogue(catalogueData));
    if (loading === "fulfilled") {
      navigate("/admin/catalogue");
    }
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
                                id="status"
                                className="form-control"
                                name="status"
                                required
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
                                id="file"
                                placeholder="Image"
                                name="Image"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setCatalogueImage({
                                      catalogueimg: file,
                                      preview: URL.createObjectURL(file),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected images are not of valid type or size!"
                                    );
                                  }
                                }}
                              />

                              {catalogueImage.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={catalogueImage.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
                            {/**pdf logic */}
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                PDF File
                              </label>
                              <input
                                type="file"
                                accept=".pdf"
                                className="form-control"
                                id="file"
                                placeholder="PDF File"
                                name="PDFFile"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (
                                    file.type === "application/pdf" &&
                                    file.size <= 100000000
                                  ) {
                                    {
                                      /* Check if the selected file is a PDF */
                                    }
                                    setCataloguePDF({
                                      cataloguepdf: file,
                                      preview: URL.createObjectURL(file),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected file is not a valid PDF or exceeds the size limit!"
                                    );
                                  }
                                }}
                              />

                              {cataloguePDF.preview && (
                                <object
                                  data={cataloguePDF.preview}
                                  type="application/pdf"
                                  width="350"
                                  height="250"
                                >
                                  {/* If browser doesn't support PDF preview, display a message */}
                                  <p>
                                    This browser does not support PDFs. Please
                                    download the PDF to view it:{" "}
                                    <a href={cataloguePDF.preview}>
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

export default AddUser;
