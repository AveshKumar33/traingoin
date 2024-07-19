import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getCartSingleProduct } from "../../../../../../redux/slices/newCartSlice";
import { uiActon } from "../../../../../../redux/slices/ui-slice";
import { fetchWishlistProducts } from "../../../../../../redux/slices/newWishlistSlice";
import ProductCard from "../../../../../../components/productcard/ProductCard";
import { isSingleProductInWishlist } from "../../../../../../utils/isInWishlist/isSingleProduct";
import Preloader from "../../../../../../components/preloader/Preloader";

const SingleProduct = () => {
  const dispatch = useDispatch();
  const { userdetails } = useSelector((state) => state.auth);
  const { wishlistProducts, loading, products } = useSelector(
    (state) => state.wishlist
  );

  const { cartSingleProduct, cartSingleLoading } = useSelector(
    (state) => state.newCartSlice
  );

  const [singleProductWishlist, setSingleProductWishlist] = useState([]);
  const [productCombinations, setProductCombinations] = useState([]);
  const [cartSingleProducts, setCartSingleProducts] = useState([]);

  useEffect(() => {
    dispatch(uiActon.title("Single Product"));
  }, [dispatch]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      Promise.all([
        dispatch(
          fetchWishlistProducts({
            product: [],
            userId: userdetails?._id,
          })
        ),
        dispatch(getCartSingleProduct({ id: userdetails?._id })),
      ]);
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (cartSingleLoading === "fulfilled" && cartSingleProduct) {
      setCartSingleProducts(cartSingleProduct);
    }
  }, [cartSingleLoading, cartSingleProduct]);

  useEffect(() => {
    if (loading === "fulfilled" && wishlistProducts && products) {
      setProductCombinations(products);
      setSingleProductWishlist(wishlistProducts);
    }
  }, [wishlistProducts, loading, products]);

  return (
    <div style={{ marginLeft: "4px" }}>
      {loading !== "pending" ? (
        productCombinations &&
        productCombinations?.length > 0 &&
        productCombinations?.map((combination) => (
          <ProductCard
            key={combination._id}
            product={combination?.singleProductId}
            colnumber={3}
            customizedproductcardheight={"38vh"}
            // collectionUrl={collectiondetails?.url}
            combinationImage={combination?.image}
            productCombination={combination}
            wishlistData={singleProductWishlist || []}
            isProductInWishlist={isSingleProductInWishlist}
            isWishlist={true}
            cartData={cartSingleProducts || []}
          />
        ))
      ) : (
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent !important",
          }}
        >
          <Preloader />
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
