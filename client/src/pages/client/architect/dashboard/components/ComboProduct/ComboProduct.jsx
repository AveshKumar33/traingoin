import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCartCustomizeComboProduct } from "../../../../../../redux/slices/newCartSlice";

import CustomizeCombinationCard from "../../../../whislist/CustomizedCombinationCard";
import { fetcCustomizedComboProductsForWishlist } from "../../../../../../redux/slices/newWishlistSlice";
import { uiActon } from "../../../../../../redux/slices/ui-slice";
import Preloader from "../../../../../../components/preloader/Preloader";

const ComboProduct = () => {
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);
  const {
    loading,
    wishlistCustomizedComboProducts,
    customizedComboForWishlist,
  } = useSelector((state) => state.wishlist);

  const { cartCustomizeComboProduct, cartCustomizeComboProductLoading } =
    useSelector((state) => state.newCartSlice);

  const [customizeComboProductWishlist, setCustomizeComboProductWishlist] =
    useState([]);
  const [customizeComboProduct, setCustomizeComboProduct] = useState([]);
  const [cartCustomizeComboProducts, setCartCustomizeComboProducts] = useState(
    []
  );

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      Promise.all([
        dispatch(
          fetcCustomizedComboProductsForWishlist({
            product: [],
            userId: userdetails?._id,
          })
        ),
        dispatch(getCartCustomizeComboProduct({ id: userdetails?._id })),
      ]);
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (
      cartCustomizeComboProductLoading === "fulfilled" &&
      cartCustomizeComboProduct
    ) {
      setCartCustomizeComboProducts(cartCustomizeComboProduct);
    }
  }, [cartCustomizeComboProductLoading, cartCustomizeComboProduct]);

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      wishlistCustomizedComboProducts &&
      customizedComboForWishlist
    ) {
      setCustomizeComboProductWishlist(wishlistCustomizedComboProducts);
      setCustomizeComboProduct(customizedComboForWishlist);
    }
  }, [loading, wishlistCustomizedComboProducts, customizedComboForWishlist]);

  useEffect(() => {
    dispatch(uiActon.title("Combo Product"));
  }, [dispatch]);

  return (
    <div>
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
        customizeComboProduct &&
        customizeComboProduct?.length > 0 &&
        customizeComboProduct.map((p) => (
          <CustomizeCombinationCard
            id={p?._id}
            product={p?.customizedComboId}
            key={p?._id}
            selectedCustomizedProduct={p?.customizedComboRectangle}
            wishlistData={customizeComboProductWishlist}
            cartData={cartCustomizeComboProducts || []}
          />
        ))
      )}
    </div>
  );
};

export default ComboProduct;
