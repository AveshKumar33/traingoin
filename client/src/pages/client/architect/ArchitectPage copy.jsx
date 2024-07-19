import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useParams } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import { Box, Tab, Tabs, Typography } from "@mui/material";
// import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import ProductCard from "../../../components/productcard/ProductCard";
import { DotProductcard } from "../roomideas/RoomIdea";
// import CustomizedProductBundleCard from "../customizedproductbundle/customizedproductbundle/CustomizedProductBundleCard";

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

const ArchitectPage = () => {
  const { url } = useParams();

  const { loading, architectsdetails } = useSelector(
    (state) => state.architect
  );

  const dispatch = useDispatch();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchProducts(url));
  }, [dispatch, url]);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <div className="container my-5">
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

            <CustomTabPanel value={value} index={0}>
              {/* <Product architectproducts={architectsdetails.NormalProducts} /> */}
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              {/* <CustomizedProduct
                architectproducts={architectsdetails.CustomizedProducts}
              /> */}
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              {/* <NormalProductBundle
                architectproducts={architectsdetails.NormalProductBundle}
              /> */}
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
              {/* <CustomizedProductBundle
                architectproducts={architectsdetails.CustomizedProductBundle}
              /> */}
            </CustomTabPanel>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export const Product = ({ architectproducts }) => {
  return (
    <>
      <div className="row">
        {architectproducts &&
          architectproducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              colnumber={3}
              customizedproductcardheight={"38vh"}
              // removeProduct={removeProductFromList}
            />
          ))}
      </div>
    </>
  );
};

export const CustomizedProduct = ({ architectproducts }) => {
  return (
    <>
      <div className="row">
        {architectproducts &&
          architectproducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              colnumber={3}
              customizedproductcardheight={"38vh"}
              // removeProduct={removeProductFromList}
            />
          ))}
      </div>
    </>
  );
};

export const NormalProductBundle = ({ architectproducts }) => {
  return (
    <>
      <div className="row">
        {architectproducts &&
          architectproducts.map((p) => (
            <DotProductcard key={p._id} dotproduct={p} />
          ))}
      </div>
    </>
  );
};

export const CustomizedProductBundle = ({ architectproducts }) => {
  return (
    <>
      <div className="row">
        {/* {architectproducts &&
            architectproducts.map((p) => (
                <CustomizedProductBundleCard
                id={p._id}
                Name={p.name}
                Image={p.ProductImage}
                Dots={p.dots}
                key={p._id}
              />
              
            ))} */}
      </div>
    </>
  );
};

export default ArchitectPage;
