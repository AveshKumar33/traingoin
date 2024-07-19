import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWishlistDotProducts } from "../../../../../../redux/slices/newWishlistSlice";
import { uiActon } from "../../../../../../redux/slices/ui-slice";
import DotProductCardRoomIdea from "../../../../roomideas/DotProductCardRoomIdea";
import DotCustomizeProductCardRoomIdea from "../../../../roomideas/DotCustomizeProductCardRoomIdea";
import { isSingleDotProductInWishlist } from "../../../../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedDotProductInWishlist } from "../../../../../../utils/isInWishlist/isSingleProduct";

const DotProduct = () => {
  const dispatch = useDispatch();

  const { userdetails } = useSelector((state) => state.auth);
  const { loading, wishlistDotProducts, dotProducts } = useSelector(
    (state) => state.wishlist
  );

  const [dotProductWishlist, setDotProductWishlist] = useState([]);
  const [dotProduct, setDotProduct] = useState([]);

  useEffect(() => {
    if (Object.keys(userdetails).length > 0) {
      dispatch(
        fetchWishlistDotProducts({
          product: [],
          userId: userdetails?._id,
        })
      );
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (loading === "fulfilled" && dotProducts && wishlistDotProducts) {
      setDotProduct(dotProducts);
      setDotProductWishlist(wishlistDotProducts);
    }
  }, [loading, dotProducts, wishlistDotProducts]);

  useEffect(() => {
    dispatch(uiActon.title("Dot Product"));
  }, [dispatch]);

  return (
    <div style={{ marginLeft: "4px" }}>
      {dotProduct &&
        dotProduct?.length > 0 &&
        dotProduct?.map((p, index) =>
          p?.type === "singleDotProduct" ? (
            <div key={index} className="col-lg-6" style={{ float: "left" }}>
              <DotProductCardRoomIdea
                key={p._id}
                dotproduct={p}
                wishlistData={dotProductWishlist || []}
                isProductInWishlist={isSingleDotProductInWishlist}
                isWishlist={true}
              />
            </div>
          ) : (
            <div className="col-lg-6" style={{ float: "left" }} key={index}>
              <DotCustomizeProductCardRoomIdea
                key={p._id}
                dotproduct={p}
                wishlistData={dotProductWishlist || []}
                isProductInWishlist={isCustomizedDotProductInWishlist}
                isWishlist={true}
              />
            </div>
          )
        )}
    </div>
  );
};

export default DotProduct;
