import React, { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import CustomizedCombinationImage from "./CustomizedCombinationImage";
import { REACT_APP_URL } from "../../../config";

const CustomizeCombinationDetailsCard = ({
  product,
  selectedCustomizedProduct,
  setComboRectangle = () => {},
  comboRectangle = {},
  setTotalPrice = () => {},
  setCurrentCombiation,
}) => {
  // const [totalPrice, setTotalPrice] = useState([]);
  const [childComponentPrice, setchildComponentPrice] = useState([]);
  const [customizedCombination, setCustomizedCombination] = useState([]);
  const updateTotalPrice = useCallback((index, price) => {
    setchildComponentPrice((prevPrices) => {
      const newPrices = [...prevPrices];
      newPrices[index] = price;
      return newPrices;
    });
  }, []);

  useEffect(() => {
    setCurrentCombiation(customizedCombination);
  }, [setCurrentCombiation, customizedCombination]);

  const totalPrice = childComponentPrice.reduce((acc, ele) => {
    return Number(acc) + Number(ele?.price);
  }, 0);

  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice, setTotalPrice]);

  return (
    <>
      <div
        className={`col-lg-6 customizedcombinationproductdetailsdivstyle`}
        
      >
        <div className="ProductCardHoverCustomizedelevation">
          <center>
            <div className="containers">
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/product/${product?.customizedComboId?.image}`}
                alt="Image_From_Server"
                className="img-fluid customizedcombinationproductdetailsimagestyle"
                // style={{ maxHeight: isShownBottomData ? "" : "78vh" }}
                // onClick={handleClick}
              />

              {selectedCustomizedProduct?.length > 0 &&
                selectedCustomizedProduct?.map((p, i) => {
                  return (
                    <div key={i}>
                      <CustomizedCombinationImage
                        id={p?._id}
                        index={i}
                        customuizedProduct={p?.customizedProductDetails}
                        comboRectangle={comboRectangle}
                        setComboRectangle={setComboRectangle}
                        key={p?._id}
                        PositionX={p?.top}
                        PositionY={p?.left}
                        Height={p?.height}
                        Width={p?.width}
                        updateTotalPrice={updateTotalPrice}
                        setCustomizedCombination={setCustomizedCombination}
                        productId={product?._id}
                      />
                    </div>
                  );
                })}

              {/* <div
                className="overlays d-flex justify-content-between  align-items-center"
                style={{
                  cursor: "pointer",
                  height: "50px",
                  zIndex:"100"
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
                <AiOutlineShoppingCart
                  style={{ fontSize: "18", color: "#fff" }}
                />
              </div> */}
            </div>
          </center>
          {/* <Link
            to={`/customized-combination/${product?.customizedComboId?._id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div style={{ padding: "10px" }}>
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
                {product?.customizedComboId?.Name}
              </h6>

              <div className="justify-content-between mb-2">
                <>
                  <center>
                    <h2
                      style={{
                        fontSize: 16,
                        color: "#463D36",
                        fontWeight: "600",
                      }}
                    >
                      ₹ {totalPrice}
                    </h2>
                  </center>
                </>
              </div>
              <p>
              {product?.customizedComboId?.Description}
              </p>
            </div>
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default CustomizeCombinationDetailsCard;
