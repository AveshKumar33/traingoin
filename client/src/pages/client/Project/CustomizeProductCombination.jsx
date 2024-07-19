import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import CustomizeProductCard from "./CustomizeProductCard";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";

function CustomizeProductCombination({ productId, collectionUrl }) {
  const [customizeProductCombinations, setCustomizeProductCombinations] =
    useState([]);

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

  /** fetch customized product  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/customized-product-combination/combination/customize/product/${productId}`
        );
        if (data?.success) {
          setCustomizeProductCombinations(data?.customizeProductsCombinations);
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {/* customized  Product Card */}
      {customizeProductCombinations &&
        customizeProductCombinations.length > 0 && (
          // <div className="row p-3">
          <>
            {customizeProductCombinations.map((combination) => (
              <CustomizeProductCard
                key={combination?._id}
                calculateCustomizedPrice={calculateCustomizedPrice}
                product={combination?.productId}
                colnumber={3}
                collectionUrl={collectionUrl}
                customizedproductcardheight={"38vh"}
                productCombination={combination?.productId}
                combination={combination}
              />
            ))}
            {/* </div> */}
          </>
        )}
    </>
  );
}

export default CustomizeProductCombination;
