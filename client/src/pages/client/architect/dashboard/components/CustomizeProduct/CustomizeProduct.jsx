import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCartCustomizeProduct } from "../../../../../../redux/slices/newCartSlice";
import { getPriceForWishlist } from "../../../../../../utils/varientimge/getPrice";
import CustomizeProductCard from "../../../../whislist/CustomizedProductCard";
import { fetchWishlistCustomizedProducts } from "../../../../../../redux/slices/newWishlistSlice";
import { uiActon } from "../../../../../../redux/slices/ui-slice";
import { isCustomizedProductInWishlist } from "../../../../../../utils/isInWishlist/isCustomizedProduct";
import Preloader from "../../../../../../components/preloader/Preloader";

const calculateCustomizedPrice = (
  productDetails,
  combinations,
  priceFor,
  { width, height }
) => {
  if (productDetails && combinations?.length > 0) {
    // const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForWishlist(productDetails, combinations, {
        DefaultWidth: width,
        DefaultHeight: height,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const CustomizeProduct = () => {
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);
  const { loading, wishlistCustomizedProducts } = useSelector(
    (state) => state.wishlist
  );

  const { cartCustomizeProduct, cartCustomizeProductLoading } = useSelector(
    (state) => state.newCartSlice
  );

  const [customizeProductWishlist, setCustomizeProductWishlist] = useState([]);
  const [cartCustomizeProducts, setCartCustomizeProducts] = useState([]);

  useEffect(() => {
    if (loading === "fulfilled" && wishlistCustomizedProducts) {
      setCustomizeProductWishlist(wishlistCustomizedProducts);
    }
  }, [loading, wishlistCustomizedProducts]);

  useEffect(() => {
    if (Object.keys(userdetails).length > 0) {
      Promise.all([
        dispatch(
          fetchWishlistCustomizedProducts({
            product: [],
            userId: userdetails?._id,
          })
        ),
        dispatch(getCartCustomizeProduct({ id: userdetails?._id })),
      ]);
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (cartCustomizeProductLoading === "fulfilled" && cartCustomizeProduct) {
      setCartCustomizeProducts(cartCustomizeProduct);
    }
  }, [cartCustomizeProductLoading, cartCustomizeProduct]);

  useEffect(() => {
    dispatch(uiActon.title("Customize Product"));
  }, [dispatch]);

  return (
    <div style={{ marginLeft: "4px" }}>
      {loading === "pending" ? (
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Preloader />
        </div>
      ) : (
        customizeProductWishlist &&
        customizeProductWishlist?.length > 0 &&
        customizeProductWishlist.map((combination) => (
          <CustomizeProductCard
            key={combination?._id}
            calculateCustomizedPrice={calculateCustomizedPrice}
            product={combination?.customizeProduct}
            colnumber={3}
            collectionUrl=""
            customizedproductcardheight={"38vh"}
            productCombination={combination?.customizeProduct}
            combination={combination}
            collectionname=""
            wishlistData={combination || []}
            cartData={cartCustomizeProducts || []}
            isProductInWishlist={isCustomizedProductInWishlist}
            isWishlist={true}
          />
        ))
      )}

      {customizeProductWishlist && customizeProductWishlist?.length === 0 && (
        <center>
          <h6
            className="text-center"
            style={{
              backgroundColor: "rgb(255,0,0,0.5)",
              width: "20%",
              borderRadius: "10px",
              padding: "12px",
              marginTop: "20px",
            }}
          >
            No Data To Show !!!
          </h6>
        </center>
      )}
    </div>
  );
};

export default CustomizeProduct;
