import React, { useCallback, useEffect, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
// import Footer from "../../../components/footer/Footer";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import ProductCard from "../../../components/productcard/ProductCard";
import CustomizeProductCard from "../../../components/productcard/CustomizeProductCard";
import Preloader from "../../../components/preloader/Preloader";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";

const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(productDetails, combinations, {
        DefaultWidth,
        DefaultHeight,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const SearchPage = () => {
  const { productname } = useParams();

  const [allproducts, setallproducts] = useState([]);
  const [customizeProductCombinations, setCustomizeProductCombinations] =
    useState([]);
  const [loader, setloader] = useState(false);

  // controller found in single product controller
  const getproduct = useCallback(async () => {
    try {
      setloader(true);
      const { data } = await axiosInstance.get(
        `api/single-product-combination/productsearch/${productname}`
      );

      if (data?.success) {
        setallproducts(data?.productsCombinations);
        setCustomizeProductCombinations(data?.customizeProductsCombinations);
        setloader(false);
      }
    } catch (error) {
      toastError(error.message);
      setloader(false);
    }
  }, [productname]);

  useEffect(() => {
    getproduct();
  }, [getproduct]);

  return (
    <>
      <StickySidebar />
      <MainHeader searchValue={productname} />
      <div
        className="div"
        style={{
          height: "60vh",
          overflow: "hidden",
          position: "relative",
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${HeaderImage})`,
          backgroundSize: "cover",
        }}
      >
        {/* <h3
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "200px",
            textTransform: "uppercase",
            fontSize: "30px",
          }}
        >
          Search Product
        </h3> */}
      </div>
      <div className="row " style={{ backgroundColor: "#fff" }}>
        <h6
          style={{
            textTransform: "uppercase",
            padding: "30px 0px 0px 50px",
            fontWeight: "600",
          }}
        >
          You Have Searched Product Name :{" "}
          <span style={{ color: "red" }}>" {productname} "</span>
        </h6>
        <br />
        <br />
        {loader ? (
          <Preloader />
        ) : allproducts.length > 0 ||
          customizeProductCombinations.length > 0 ? (
          <>
            <div
              className="row"
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
                marginTop: "10px",
                marginLeft: "12px",
                marginBottom: "10px",
              }}
            >
              <>
                {allproducts &&
                  allproducts.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p?.singleProductId}
                      colnumber={3}
                      customizedproductcardheight={""}
                      collectionUrl=""
                      combinationImage={p?.image}
                      productCombination={p}
                      collectionname=""
                    />
                  ))}
              </>
              {customizeProductCombinations &&
                customizeProductCombinations.length > 0 && (
                  <>
                    {customizeProductCombinations.map((combination) => (
                      <CustomizeProductCard
                        key={combination?._id}
                        calculateCustomizedPrice={calculateCustomizedPrice}
                        product={combination?.productId}
                        colnumber={3}
                        collectionUrl=""
                        customizedproductcardheight={"38vh"}
                        productCombination={combination?.productId}
                        combination={combination}
                        collectionname=""
                      />
                    ))}
                  </>
                )}
            </div>
          </>
        ) : (
          <>
            <h4 className="text-center my-5 ">No Any Product Matched...</h4>
          </>
        )}
      </div>

      {/* <div className="row my-4">
        <h1 className="text-center">Search</h1>
        <h6 className="text-center">{productname}</h6>

        {allproducts &&
          allproducts.map((p) => (
            <>
              <ProductCard key={p._id} product={p} />
            </>
          ))}
      </div> */}

      <MainFooter />
    </>
  );
};

export default SearchPage;
