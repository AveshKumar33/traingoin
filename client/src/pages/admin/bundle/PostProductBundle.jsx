import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { MultiSelect } from "react-multi-select-component";
import { FaTrash } from "react-icons/fa";
import TopHeader from "../../../components/topheader/TopHeader";
import Select from "react-select";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { createProductBundle } from "../../../redux/slices/bundleSlice";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

const PostProductBundle = () => {

  
  const { loading, productBundle, success } = useSelector((state) => state.productBundle);
  const { products } = useSelector((state) => state.products);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [productBundleimage, setproductBundleImage] = useState();
  const [selected, setSelected] = useState([]);
  const [productimage, setProductImage] = useState();
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    BundleName: "",
    url: "",
  });

  const { BundleName, url} = formData;

  const handleFormChange = (e) => {
    if (e.target.name === "Rating" && e.target.value > 5) {
      alert("Rating Can't be more than 5");
      e.target.value = 5;
      return;
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {


    const filteredproductvalue = selected.map((p) => {
      return p.value;
    });



    e.preventDefault();
    let productBundledata = new FormData();

    productBundledata.append("BundleName", BundleName);
    productBundledata.append("url", url === ""
    ? BundleName.replace(/\s+/g, "-")
    : url);

    productBundledata.append("products", JSON.stringify(filteredproductvalue));

    for (let i = 0; i < productimage.length; i++) {

      if (productimage[i].size >= 2000000) {
        toast.error(`${productimage[i].name} Size greater than 2 MB`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      
      productBundledata.append("bundleimg", productimage[i]);
    }

   
    dispatch(createProductBundle(productBundledata));

    if (loading === "fulfilled" && success) {
      navigate("/admin/product-bundle");
    }
  };


  const handleImage = (e) => {
    e.preventDefault();
    setProductImage(e.target.files);
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemove = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

  };


  return (
    <>
      <SideBar />
     {/* <section className="main_content dashboard_part large_header_bg"> */}
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
                          <h3 className="m-0">productBundle</h3>
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
                                name="BundleName"
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            
                           
                            <div className="col-md-12">
                            <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than 2 MB"
                              )
                            </label>
                            <div className="upload-container">
                              <center>
                                <input
                                  type="file"
                                  id="file_upload"
                                  required
                                  multiple
                                  onChange={handleImage}
                                />
                              </center>
                            </div>
                            <div
                              className="preview-container d-flex row"
                              style={{ padding: "0px" }}
                            >
                              {images?.length !== 0 &&
                                images.map((image, index) => (
                                  <>
                                    <div
                                      className="productimage-area col-3"
                                      key={index}
                                    >
                                      <img
                                          loading="lazy"
                                        src={image.preview}
                                        alt="Preview"
                                        style={{
                                          width: "100vw",
                                          height: "100px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <button
                                        className="productremove-image"
                                        type="button"
                                        style={{ display: "inline" }}
                                        onClick={() => handleRemove(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </>
                                  // <div key={index} className="image-preview">
                                  //   <img
                                  //     src={image.preview}
                                  //     alt="Preview"
                                  //     style={{ height: "100px" }}
                                  //   />
                                  //   <button onClick={() => handleRemove(index)}>
                                  //     Remove
                                  //   </button>
                                  // </div>
                                ))}
                            </div>
                          </div>








                              {/* <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="productBundleBody"
                                required
                                onChange={(e) =>
                                  setproductBundleImage(e.target.files[0])
                                }
                              /> */}
                            </div>

                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Product
                              </label>

                              {products && (
                                <>
                                  <MultiSelect
                                    options={products.map((p) => {
                                      return {
                                        label: p.ProductName,
                                        value: p._id,
                                      };
                                    })}
                                    required
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select Tag"
                                  />
                                </>
                              )}

                              {/* {products && (
                                <>
                                  <Select
                                    className="col-12"
                                    defaultValue={selected}
                                    onChange={setSelected}
                                    options={products.map((p) => {
                                      return {
                                        label: p.ProductName,
                                        value: p._id,
                                      };
                                    })}
                                  />
                                </>
                              )} */}


                            </div>

                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Url
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Title"
                                placeholder="Enter Url"
                                name="url"
                                required
                                onChange={handleFormChange}
                              />
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

export default PostProductBundle;
