import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../redux/slices/cartSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiTwotoneHeart } from "react-icons/ai";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

import { removeToWhislist } from "../../redux/slices/wishlistSlice";
import { toastSuceess } from "../../utils/reactToastify";
import { REACT_APP_URL } from "../../config";
import CustomizedCombinationImage from "../../pages/client/customizedCombination/CustomizedCombinationImage";

const CustomizeComboWishlistCart = ({
  product,
  isShownBottomData = true,
  id,
  colnumber = 6,
  removeProduct,
  setTotalPrice = () => {},
}) => {
  const dispatch = useDispatch();

  // const [totalPrice, setTotalPrice] = useState([]);
  const [childComponentPrice, setchildComponentPrice] = useState([]);
  const [cartdata, setCartadata] = useState([]);

  const updateTotalPrice = useCallback((index, price) => {
    setchildComponentPrice((prevPrices) => {
      const newPrices = [...prevPrices];
      newPrices[index] = price;
      return newPrices;
    });
  }, []);

  const handlRemoveToWhislist = (id) => {
    console.log("handlRemoveToWhislist called", id);
    dispatch(removeToWhislist(id));
    toastSuceess(` Removed rrrr to Whishlist !`);
  };

  const handleCartdata = (index, cartdatanew) => {
    //Cartdata overriding
    setCartadata((prevcartdata) => {
      const newCartdata = [...prevcartdata];
      newCartdata[index] = cartdatanew;
      return newCartdata;
    });
  };

  const totalPrice = childComponentPrice.reduce((acc, ele) => {
    return Number(acc) + Number(ele?.price);
  }, 0);

  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice, setTotalPrice]);

  const handleCart = () => {
    cartdata.forEach((p) => {
      const {
        id,
        name,
        frontvarientset,
        backvarientset,
        backselected,
        backpriceprice,
        frontprice,
        frontcustomizedproductImage,
        backcustomizedproductImage,
        ...others
      } = p;

      if (frontvarientset && Object.keys(frontvarientset).length > 0) {
        dispatch(
          addTocart({
            product: {
              id,
              name,
              price: frontprice,
              customizedProductImage: frontcustomizedproductImage,
              ...others,
              ...frontvarientset,
            },
          })
        );
      }
      if (backvarientset && Object.keys(backvarientset).length > 0) {
        dispatch(
          addTocart({
            product: {
              name: `${name} (${backselected})`,
              id: `${id}id`,
              price: backpriceprice,
              customizedProductImage: backcustomizedproductImage,
              ...others,
              ...backvarientset,
            },
          })
        );
      }
    });
    toastSuceess("Product Bundle Added to Cart");
  };

  //console.log("product", product);

  return (
    <>
      <div className={`col-md-${colnumber} mt-2 mb-5`}>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: isShownBottomData ? "" : "50px",
          }}
        >
          <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/product/${product?.customizedComboId?.image}`}
            alt="Image_From_Server"
            className="img-fluid"
            style={{ maxHeight: isShownBottomData ? "" : "78vh" }}
            // onClick={handleClick}
          />
          {product?.rectangles?.length > 0 &&
            product?.rectangles?.map((p, i) => {
              return (
                <div key={i}>
                  <CustomizedCombinationImage
                    id={p?._id}
                    index={i}
                    customuizedProduct={p?.customizedProductDetails}
                    key={p?._id}
                    PositionX={p?.top}
                    PositionY={p?.left}
                    Height={p?.height}
                    Width={p?.width}
                    updateTotalPrice={updateTotalPrice}
                    handleCartdata={handleCartdata}
                  />
                </div>
              );
            })}
        </div>
        {/* {isShownBottomData && (
          <Link
            to={`/customized-combination/${product?.customizedComboId?._id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              className="p-3"
              style={{
                backgroundColor: "#E9860E",
                color: "#fff",
                borderRadius: "0px 0px 20px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h6 className=" text-light">
                  Name : {product?.customizedComboId?.Name}
                </h6>
                <h6 className=" text-light">Price : {totalPrice}</h6>
              </div>
              <div className="text-light">
                <AiOutlineShoppingCart size={30} onClick={() => handleCart()} />
              </div>
            </div>
          </Link>
        )} */}
        {isShownBottomData && (
          <div
            className="p-3"
            style={{
              backgroundColor: "#E9860E",
              color: "#fff",
              borderRadius: "0px 0px 20px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h6 className=" text-light">
                Name : {product?.customizedComboId?.Name}
              </h6>
              <h6 className=" text-light">Price : {totalPrice}</h6>
            </div>
            {/* Place the Link component outside the div */}
            <Link
              to={`/customized-combination/${product?.customizedComboId?._id}`}
              style={{
                textDecoration: "none",
              }}
            >
              <div className="text-light" style={{ marginLeft: "450px" }}>
                <AiOutlineShoppingCart size={30} onClick={() => handleCart()} />
              </div>
              {/* Empty div */}
            </Link>

            <div className="text-light">
              <div>
                <RemoveShoppingCartIcon
                  size={30}
                  color="#463D36"
                  onClick={() =>
                    handlRemoveToWhislist(product?.customizedComboId?._id)
                  }
                />
              </div>
            </div>
            <div />
          </div>
        )}

        {removeProduct && (
          <>
            <button onClick={() => removeProduct(id)}>Remove Product</button>
          </>
        )}
      </div>

      {/* {!id && <button onClick={() => handleCart()}>Add To Cart</button>} */}
    </>
  );
};

export default CustomizeComboWishlistCart;
