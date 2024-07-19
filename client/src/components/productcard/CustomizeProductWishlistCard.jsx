import React, { useState, useEffect } from "react";
import { REACT_APP_URL } from "../../config";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../redux/slices/cartSlice";
// import CartSidebar from "../cartSidebar/CartSidebar";
import { toast } from "react-toastify";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
// import ProductCustomizedProduct from "../../pages/client/productdetails/customizedproduct/ProductCustomizedProduct";
// import { AiOutlineHeart } from "react-icons/ai";
import { removeToWhislist } from "../../redux/slices/wishlistSlice";
import { toastSuceess } from "../../utils/reactToastify";
import { BsFillCartFill } from "react-icons/bs";
import "./productcard.css";
import RaiseAQuery from "../../pages/client/RaiseAQuery/RaiseAQuery.jsx";
import { CustomizedFinialAmount } from "../../utils/usefullFunction.js";
import { IoMdHeartDislike } from "react-icons/io";

const getUOM = (arr) =>
  arr.find((ele) => ele?.UOMId?.name !== "Pice" && ele?.UOMId?.name);

const CustomizeProductWishlistCard = ({
  product,
  colnumber = 2,
  removeProduct,
  collectionUrl,
  productCombination,
  collectionname,
  calculateCustomizedPrice,
  combination,
}) => {
  const dispatch = useDispatch();
  const newCollectionUrl = collectionUrl ?? collectionname;

  // const [managecart, setmanagecart] = useState(false)

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (combination) {
      // for front
      const FrontPrice = calculateCustomizedPrice(
        combination?.productId,
        combination?.Front,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back
      if (combination?.SAF?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.SAF,
          "FixedPriceSAF"
        );
      } else if (combination?.CB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.CB,
          "FixedPriceCB"
        );
      } else if (combination?.IB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.IB,
          "FixedPriceIB"
        );
      }

      const total = FrontPrice + BackPrice;
      setTotalPrice(total);
    }
  }, [combination, calculateCustomizedPrice]);

  const [ShowRaiseAQueryModal, setShowRaiseAQueryModal] = useState(false);

  const handleAddTocart = (name, price, id, img, maxqty, gst = 0) => {
    const product = {
      name,
      quantity: 1,
      price: price,
      id,
      img,
      sellingType: "Normal",
      maxquantity: maxqty,
      gst,
    };

    dispatch(addTocart({ product: product }));
    toast(`${name}, Added to Cart !`);

    // setmanagecart(true);
  };

  const handlRemoveToWhislist = (id) => {
    dispatch(removeToWhislist(id));

    toastSuceess(` Removed to Whishlist !`);
  };

  const handleClicked = () => {
    setShowRaiseAQueryModal(true);
  };

  const RaiseModalClose = () => {
    setShowRaiseAQueryModal(false);
  };

  return (
    <>
      <RaiseAQuery
        showRaiseAQueryModal={ShowRaiseAQueryModal}
        RaiseModalClose={RaiseModalClose}
        product={product}
      />

      <div
        className={`col-lg-4`}
        style={{
          float: "left",
          marginRight: "5px",
          width: "33.2vw",
          paddingRight: "0px",
          paddingLeft: "0px",
          marginTop: "5px",
        }}
      >
        <div className="ProductCardHover">
          <center>
            <div className="containers">
              <IoMdHeartDislike
                size={22}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 2,
                  cursor: "pointer",
                  color: "red",
                }}
                onClick={() => handlRemoveToWhislist(product?._id)}
              />
              <Link
                to={`/customized-product/${
                  newCollectionUrl
                    ? newCollectionUrl
                    : product?.Collection[0]?.url
                }/${product?.Urlhandle}`}
              >
                <img
                  src={`${REACT_APP_URL}/images/product/${productCombination?.ProductImage[0]}`}
                  alt="img25"
                  className="img-fluid"
                  style={{
                    height: "65vh",
                    width: "33.2vw",
                  }}
                />
              </Link>

              <div
                className="overlays d-flex justify-content-between  align-items-center"
                style={{
                  cursor: "pointer",
                  height: "50px",
                }}
                onClick={() => {
                  handleAddTocart(
                    productCombination?.ProductName,
                    productCombination?.SalePrice,
                    productCombination?._id,
                    productCombination?.ProductImage[0],
                    productCombination?.ProductInStockQuantity,
                    productCombination?.singleProductId?.GSTIN
                  );
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    color: "#fff",
                    letterSpacing: "1px",
                    paddingTop: "10px",
                  }}
                >
                  Add To Cart
                </h2>
                <BsFillCartFill style={{ fontSize: "18", color: "#fff" }} />
              </div>

              {removeProduct && (
                <>
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="btn btn-primary"
                  >
                    Remove From Page
                  </button>
                </>
              )}
            </div>
          </center>

          <div style={{ padding: "10px" }}>
            <Link
              to={`/customized-product/${
                newCollectionUrl
                  ? newCollectionUrl
                  : product?.Collection[0]?.url
              }/${product?.Urlhandle}`}
              style={{ textDecoration: "none" }}
            >
              <h6
                style={{
                  textDecoration: "none",
                  color: "#463D36",
                  textAlign: "center",
                  fontSize: "16px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                {productCombination?.ProductName}
              </h6>
            </Link>

            <div className="justify-content-between mb-2">
              {product?.RequestForPrice ? (
                <>
                  <center>
                    <button
                      className="badge btn-default Request-for-Price-btn p-2"
                      type="button"
                      onClick={() => handleClicked()}
                    >
                      Request for Price
                    </button>
                  </center>
                </>
              ) : (
                <>
                  <center>
                    <h2
                      style={{
                        fontSize: 16,
                        color: "#463D36",
                        fontWeight: "600",
                      }}
                    >
                      {`Rs. ${CustomizedFinialAmount(totalPrice, product)} / ${
                        getUOM(product?.attribute)?.UOMId?.name
                          ? getUOM(product?.attribute)?.UOMId?.name === "Length"
                            ? "Running Feet"
                            : getUOM(product?.attribute)?.UOMId?.name
                          : "Pice"
                      }`}
                    </h2>
                  </center>
                </>
              )}
              {/* <RemoveShoppingCartIcon
                size={22}
                // color="#463D36"
                onClick={() => handlRemoveToWhislist(product?._id)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeProductWishlistCard;
