import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import {
  fetchCustomizedProducts,
  fetchProducts,
} from "../../../redux/slices/productSlice";
import Preloader from "../../../components/preloader/Preloader";
import { fetchdotProduct } from "../../../redux/slices/dotProductSlice";
import { fetchdotCustomizedProduct } from "../../../redux/slices/dotCustomizedProductSlice";
import ProductCard from "../../../components/productcard/ProductCard";
import { DotProductcard } from "../roomideas/RoomIdea";
// import CustomizedProductBundleCard from "../customizedproductbundle/customizedproductbundle/CustomizedProductBundleCard";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import {
  VerifyArchitect,
  fetchArchitectDetails,
  logoutArchitect,
  removeProduct,
  updateArchitect,
} from "../../../redux/slices/architectSlice";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ArchitectDashboard = () => {
  const { loading, architectsdetails, ArchitectAuth } = useSelector(
    (state) => state.architect
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ArchitectDashBoard`
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

  // useEffect(() => {
  //   if (ArchitectAuth) {
  //     // verifyUser();
  //   }
  // }, []);

  const verifyUser = async () => {
    try {
      const { data } = await dispatch(VerifyArchitect()).unwrap();

      toastSuceess(data.message);
    } catch (error) {
      toastError(error);
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await dispatch(logoutArchitect()).unwrap();

      toastSuceess(data.message);
    } catch (error) {
      toastError(error);
    }
  };

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
        
      </div>

      {/* 
      <button className="btn btn-primary" onClick={verifyUser}>
        Verify User
      </button> */}
      <div className="container my-5">
        <div className="row justify-content-end mx-5">
          <div className="col-md-1 ">
            <button className="btn btn-primary" onClick={() => handleLogout()}>
              Logout
            </button>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Product" {...a11yProps(0)} />
                <Tab label="Customized Product" {...a11yProps(1)} />
                <Tab label="Normal Product Bundle" {...a11yProps(2)} />
                <Tab label="Customized Product Bundle" {...a11yProps(3)} />
              </Tabs>
            </Box>

            {/* <CustomTabPanel value={value} index={0}>
              <Product
                architectId={architectsdetails?._id}
                architectproducts={architectsdetails?.NormalProducts}
                handleChange={handleChange}
              />
            </CustomTabPanel> */}

            {/* <CustomTabPanel value={value} index={1}>
              <CustomizedProduct
                architectId={architectsdetails?._id}
                architectproducts={architectsdetails?.CustomizedProducts}
                handleChange={handleChange}
              />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              <ProductBundle
                architectId={architectsdetails?._id}
                architectproducts={architectsdetails?.NormalProductBundle}
                handleChange={handleChange}
              />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
              <CustomizedProductBundle
                architectId={architectsdetails?._id}
                architectproducts={architectsdetails?.CustomizedProductBundle}
                handleChange={handleChange}
              />
            </CustomTabPanel> */}
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

const Product = ({ architectId, architectproducts, handleChange }) => {
  const dispatch = useDispatch();

  const { architectsdetails } = useSelector((state) => state.architect);

  const { loading, products } = useSelector((state) => state.products);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const removeProductFromList = async (removeproductId) => {
    try {
      const updatearchitectdata = {
        id: architectId,
        architectdata: {
          NormalProducts: removeproductId,
        },
      };
      await dispatch(removeProduct(updatearchitectdata)).unwrap();

      toastSuceess("Product Removed Successfully");
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const idscollection = selected.map((p) => {
        return p.value;
      });

      const upadatedata = {
        id: architectId,
        enquirydata: {
          NormalProducts: idscollection,
        },
      };

      const productdata = await dispatch(updateArchitect(upadatedata)).unwrap();

      handleChange("", 0);
    } catch (error) {
      toastError(error);
    }
  };

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <div className="container">
        {/* Multi Select Box */}

        <div className="row  d-flex justify-content-center my-3">
          <div className="col-md-8 d-flex ">
            <div style={{ flex: 3, margin: "0px 12px" }}>
              <MultiSelect
                options={products.map((p) => {
                  return {
                    label: p.ProductName,
                    value: p._id,
                  };
                })}
                value={selected}
                onChange={setSelected}
                labelledBy="Select Tag"
              />
            </div>
            <button
              className="btn"
              style={{ flex: 1, backgroundColor: "#475B52", color: "#fff" }}
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Product Card */}

        <div className="row">
          {architectproducts &&
            architectproducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                colnumber={3}
                customizedproductcardheight={"38vh"}
                removeProduct={removeProductFromList}
                // removeproduct={true}
              />
            ))}
        </div>
      </div>
    </>
  );
};

const CustomizedProduct = ({
  architectId,
  architectproducts,
  handleChange,
}) => {
  const dispatch = useDispatch();

  const { architectsdetails } = useSelector((state) => state.architect);

  const { loading, products } = useSelector((state) => state.products);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchCustomizedProducts());
  }, []);

  const removeProductFromList = async (removeproductId) => {
    try {
      const updatearchitectdata = {
        id: architectId,
        architectdata: {
          CustomizedProducts: removeproductId,
        },
      };
      await dispatch(removeProduct(updatearchitectdata)).unwrap();

      toastSuceess("Product Removed Successfully");
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const idscollection = selected.map((p) => {
        return p.value;
      });

      const upadatedata = {
        id: architectId,
        enquirydata: {
          CustomizedProducts: idscollection,
        },
      };
      const productdata = await dispatch(updateArchitect(upadatedata)).unwrap();
      handleChange("", 1);
    } catch (error) {
      toastError(error);
    }
  };

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row  d-flex justify-content-center my-3">
          <div className="col-md-8 d-flex ">
            <div style={{ flex: 3, margin: "0px 12px" }}>
              <MultiSelect
                options={products.map((p) => {
                  return {
                    label: p.ProductName,
                    value: p._id,
                  };
                })}
                value={selected}
                onChange={setSelected}
                labelledBy="Select Tag"
              />
            </div>
            <button
              className="btn"
              style={{ flex: 1, backgroundColor: "#475B52", color: "#fff" }}
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="row">
          {architectproducts &&
            architectproducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                colnumber={3}
                customizedproductcardheight={"38vh"}
                removeProduct={removeProductFromList}
              />
            ))}
        </div>
      </div>
    </>
  );
};

const ProductBundle = ({ architectId, architectproducts, handleChange }) => {
  const { architectsdetails } = useSelector((state) => state.architect);

  const { loading, dotproducts } = useSelector((state) => state.dotProduct);

  const removeProductFromList = async (removeproductId) => {
    try {
      const updatearchitectdata = {
        id: architectId,
        architectdata: {
          NormalProductBundle: removeproductId,
        },
      };
      await dispatch(removeProduct(updatearchitectdata)).unwrap();

      toastSuceess("Product Removed Successfully");
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const idscollection = selected.map((p) => {
        return p.value;
      });

      const upadatedata = {
        id: architectId,
        enquirydata: {
          NormalProductBundle: idscollection,
        },
      };

      const productdata = await dispatch(updateArchitect(upadatedata)).unwrap();

      handleChange("", 2);
    } catch (error) {
      toastError(error);
    }
  };

  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchdotProduct());
  }, [dispatch]);

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <div className="container">
        <div className="row  d-flex justify-content-center my-3">
          <div className="col-md-8 d-flex ">
            <div style={{ flex: 3, margin: "0px 12px" }}>
              <MultiSelect
                options={dotproducts.map((p) => {
                  return {
                    label: p.name,
                    value: p._id,
                  };
                })}
                value={selected}
                onChange={setSelected}
                labelledBy="Select Tag"
              />
            </div>
            <button
              className="btn"
              style={{ flex: 1, backgroundColor: "#475B52", color: "#fff" }}
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>
        <div className="row">
          {architectproducts &&
            architectproducts.map((p) => (
              <DotProductcard
                key={p._id}
                dotproduct={p}
                removeProduct={removeProductFromList}
              />
            ))}
        </div>
      </div>
    </>
  );
};

const CustomizedProductBundle = ({
  architectId,
  architectproducts,
  handleChange,
}) => {
  const { loading, dotCustomizedproducts } = useSelector(
    (state) => state.dotCustomizedproduct
  );

  const dispatch = useDispatch();

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchdotCustomizedProduct());
  }, [dispatch]);

  const handleAddProduct = async () => {
    try {
      const idscollection = selected.map((p) => {
        return p.value;
      });

      const upadatedata = {
        id: architectId,
        enquirydata: {
          CustomizedProductBundle: idscollection,
        },
      };

      const productdata = await dispatch(updateArchitect(upadatedata)).unwrap();

      handleChange("", 3);
    } catch (error) {
      toastError(error);
    }
  };

  const removeProductFromList = async (removeproductId) => {
    try {
      const updatearchitectdata = {
        id: architectId,
        architectdata: {
          CustomizedProductBundle: removeproductId,
        },
      };
      await dispatch(removeProduct(updatearchitectdata)).unwrap();

      toastSuceess("Product Removed Successfully");
    } catch (error) {
      toastError(error);
    }
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <div className="container">
        <div className="row  d-flex justify-content-center my-3">
          <div className="col-md-8 d-flex ">
            <div style={{ flex: 3, margin: "0px 12px" }}>
              <MultiSelect
                options={dotCustomizedproducts.map((p) => {
                  return {
                    label: p.name,
                    value: p._id,
                  };
                })}
                value={selected}
                onChange={setSelected}
                labelledBy="Select Tag"
              />
            </div>
            <button
              className="btn"
              style={{ flex: 1, backgroundColor: "#475B52", color: "#fff" }}
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="row">
          {/* {architectproducts &&
            architectproducts.map((p) => (
              <CustomizedProductBundleCard
                id={p._id}
                Name={p.name}
                Image={p.ProductImage}
                Dots={p.dots}
                key={p._id}
                removeProduct={removeProductFromList}
              />
            ))} */}
        </div>
      </div>
    </>
  );
};

export default ArchitectDashboard;
