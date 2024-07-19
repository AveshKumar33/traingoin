import React, { useState } from "react";
// import busimg from "../../assets/Image/si1.png";
// import productimg from "../../assets/Image/Twin-Sleeper-Sofa.jpg";
import { REACT_APP_URL } from "../../config";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../redux/slices/cartSlice";
// import CartSidebar from "../cartSidebar/CartSidebar";
import { toast } from "react-toastify";
import { AiTwotoneHeart } from "react-icons/ai";
import { removeToWhislist } from "../../redux/slices/wishlistSlice";
import { toastSuceess } from "../../utils/reactToastify";
import { BsFillCartFill } from "react-icons/bs";
import "./productcard.css";
import RaiseAQuery from "../../pages/client/RaiseAQuery/RaiseAQuery.jsx";
import { FinialAmount } from "../../utils/usefullFunction.js";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { IoMdHeartDislike } from "react-icons/io";

const SingleProductWishlistCard = ({
  product,
  colnumber = 2,
  removeProduct,
  collectionname,
  collectionUrl,
  productCombination,
}) => {
  const dispatch = useDispatch();
  const newCollectionUrl = collectionUrl ?? collectionname;
  // const [managecart, setmanagecart] = useState(false)

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

  const images =
    productCombination?.image !== "default.png"
      ? [productCombination?.image]
      : productCombination?.singleProductId?.ProductImage[0];

  const directory =
    productCombination?.image !== "default.png"
      ? "singleProductCombination"
      : "product";

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
              <Link
                to={`/product/${
                  newCollectionUrl
                    ? newCollectionUrl
                    : product?.Collection[0]?.url
                }/${product.Urlhandle}`}
              >
                <IoMdHeartDislike
                  size={22}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                    cursor: "pointer",
                    color:"red",
                  }}
                  onClick={() => handlRemoveToWhislist(product?._id)}
                />
                <img
                  src={`${REACT_APP_URL}/images/${directory}/${images}`}
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
                    productCombination?.singleProductId?.ProductName,
                    productCombination?.SalePrice,
                    productCombination._id,
                    images,
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
            </div>
          </center>
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

          <div style={{ padding: "10px" }}>
            <Link
              to={`/product/${
                newCollectionUrl
                  ? newCollectionUrl
                  : product?.Collection[0]?.url
              }/${product.Urlhandle}`}
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
                {productCombination?.singleProductId?.ProductName}
              </h6>
            </Link>

            <div className="justify-content-between mb-2">
              {product?.RequestForPrice ? (
                <center>
                <button
                  className="badge btn-default Request-for-Price-btn p-2"
                  type="button"
                  onClick={() => handleClicked()}
                >
                  Request for Price
                </button>
                </center>
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
                    ₹ {FinialAmount(productCombination?.SalePrice, product)}
                    &nbsp; &nbsp;
                    <strike>
                      ₹{FinialAmount(productCombination?.MRP, product)}
                    </strike>
                  </h2>
                  </center>
                </>
              )}
              {!product.RequestForPrice && (
                <center>
              <h6 className="text-start">
                Save ₹{" "}
                {FinialAmount(Number(productCombination?.MRP), product) -
                  FinialAmount(
                    Number(productCombination?.SalePrice),
                    product
                  )}{" "}
                (
                {(
                  100 -
                  (FinialAmount(
                    Number(productCombination?.SalePrice),
                    product
                  ) /
                    FinialAmount(Number(productCombination?.MRP), product)) *
                    100
                ).toFixed(2)}
                %)
              </h6>
              </center>
            )}
              {/* <RemoveShoppingCartIcon
                size={22}
                color="#463D36"
                onClick={() => handlRemoveToWhislist(product?._id)}
              /> */}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductWishlistCard;
