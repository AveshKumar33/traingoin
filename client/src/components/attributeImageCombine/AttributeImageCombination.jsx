import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getvarientimage } from "../../utils/varientimge/VarientImage";
import { REACT_APP_URL } from "../../config";
import Preloader from "../preloader/Preloader";
import { fetchProductsDetails } from "../../redux/slices/productSlice";
import { useParams } from "react-router-dom";

const AttributeImageCombination = () => {
  const { loading, productdetails } = useSelector((state) => state.products);
  const { id } = useParams();

  const [varientImages, setvarientImage] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsDetails(id));
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled") {
      if (productdetails?.attribute?.length > 0 && productdetails.varient[0]) {
        let varientimage = getvarientimage(
          productdetails.attribute,
          productdetails.varient[0]
        );

        let ss = varientimage.map((p, i) => {
          return {
            ...p,
            positionx:
              productdetails.attributePosition[
                i % productdetails.attributePosition.length
              ].PositionX,
            positiony:
              productdetails.attributePosition[
                i % productdetails.attributePosition.length
              ].PositionY,
          };
        });
        setvarientImage(ss);
      }
    }
  }, [loading]);

  console.log(varientImages, "varientImagesvarientImages");
  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          height: "700px",
          width: "700px",
          overflow: "hidden",
        }}
      >
        {varientImages.length > 0 &&
          varientImages.map((img, i) => (
            <>
              <img
                loading="lazy"
                key={img}
                src={`${REACT_APP_URL}/images/attribute/${img.Photo}`}
                alt="Preview"
                style={{
                  position: "absolute",
                  top: `${img.positiony}%`,
                  left: `${img.positionx}%`,
                  width: "100%",
                  height: "100%",
                }}
              />
            </>
          ))}
      </div>
    </>
  );
};

export default AttributeImageCombination;
