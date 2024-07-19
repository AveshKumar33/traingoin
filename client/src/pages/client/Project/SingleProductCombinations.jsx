import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import ProductCard from "./ProductCard";
function SingleProductCombinations({ productId, collectionUrl }) {
  const [productCombinations, setProductCombinations] = useState([]);
  console.log("Product combinations", productCombinations);
  /** fetch customized product  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/single-product-combination/combination/single/product/${productId}`
        );
        if (data?.success) {
          setProductCombinations(data?.productsCombinations);
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {/* single Product Card */}
      {productCombinations && productCombinations.length > 0 && (
        // <div className="row p-3">
        <>
          {productCombinations.map((combination) => (
            <ProductCard
              key={combination._id}
              product={combination?.singleProductId}
              colnumber={3}
              customizedproductcardheight={"38vh"}
              collectionUrl={collectionUrl}
              combinationImage={combination?.image}
              productCombination={combination}
              cartData={[]}
            />
          ))}
          {/* </div> */}
        </>
      )}
    </>
  );
}

export default SingleProductCombinations;
