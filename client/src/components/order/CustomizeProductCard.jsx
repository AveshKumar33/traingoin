import React from "react";

import "./styles.css";
import { REACT_APP_URL } from "../../config";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const CustomizeProductCard = ({
  product,
  combination,
  orderProducts,
  setStatus,
  isAdmin,
}) => {
  return (
    <tr>
      <td>
        <Link
          to={`/customized-product/${product?.Collection[0]?.url}/${
            product?.Urlhandle
          }?productType=${"customizeProducts"}&orderId=${
            orderProducts?._id
          }&orderItemId=${combination?._id}`}
        >
          <ImageCreation
            customuizedProductFront={combination?.FrontCombinations}
          />
        </Link>
      </td>
      <td>
        <p style={{ fontSize: "17px", backgroundColor: "transparent" }}>
          {product?.ProductName}
        </p>
      </td>
      <td style={{ textAlign: "center", fontWeight: "600" }}>
        ₹ {combination?.productAmount}
      </td>
      <td style={{ textAlign: "center", fontWeight: "600" }}>
        {combination?.quantity}
      </td>

      <td style={{ textAlign: "right", fontWeight: "600" }}>
        {!isAdmin && (
          <Button
            onClick={() => setStatus(combination)}
            variant="contained"
            disableElevation
            color="success"
            size="small"
            style={{ backgroundColor: "#475B52" }}
          >
            Status
          </Button>
        )}
        &nbsp;
        {isAdmin && (
          <Button
            href={`/admin/order/status/customizeProducts/${orderProducts?._id}/${combination?._id}`}
            variant="outlined"
            color="success"
            size="small"
          >
            Update Status
          </Button>
        )}
        &nbsp;
        {isAdmin && (
          <Button
            href={`/customized-product/${product?.Collection[0]?.url}/${
              product?.Urlhandle
            }?productType=${"customizeProducts"}&orderId=${
              orderProducts?._id
            }&orderItemId=${combination?._id}`}
            variant="outlined"
            color="warning"
            size="small"
          >
            View Product
          </Button>
        )}
      </td>
    </tr>
  );
};

export default CustomizeProductCard;

const ImageCreation = ({ customuizedProductFront }) => {
  return (
    <>
      <div
        style={{
          position: "relative", // Add position relative to contain absolute positioning of child images
          // height: "80vh",
          backgroundColor: "transparent",
        }}
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              key={i}
              src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
              alt="Preview"
              style={{
                position: i === 0 ? "relative" : "absolute", // Position images absolutely within the parent div
                top: 0,
                left: 0,
                // width: "300px",
                height: "15vh",
                objectFit: "cover", // Ensure the image fills its container without distortion
                zIndex: img?.attributeId?.BurgerSque, // Use zIndex from the image attribute
              }}
            />
          ))}
      </div>
    </>
  );
};
