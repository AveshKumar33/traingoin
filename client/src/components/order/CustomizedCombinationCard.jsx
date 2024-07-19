import React from "react";

import { REACT_APP_URL } from "../../config";

import Button from "@mui/material/Button";

import CustomizedCombinationImage from "../../pages/client/whislist/CustomizedCombinationImage";
import { Link } from "react-router-dom";

const CustomizedCombinationCard = ({
  product,
  selectedCustomizedProduct,
  data,
  setStatus,
  orderProducts,
  isAdmin,
}) => {
  return (
    <tr>
      <td>
        <div className="ImageContainer" style={{ position: "relative" }}>
          {product && product?.image && (
            <Link to={`/customized-combination/${product?._id}`}>
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/product/${product?.image}`}
                alt="Image_From_Server"
                className="img-fluid"
                style={{ height: "15vh" }}
              />
            </Link>
          )}

          {selectedCustomizedProduct?.length > 0 &&
            selectedCustomizedProduct?.map((p, i) => {
              return (
                <div key={i}>
                  <CustomizedCombinationImage
                    id={p?.customizedComboRectangleId?._id}
                    productId={product?._id}
                    index={i}
                    customuizedProduct={p?.customizedProductId}
                    combination={p}
                    key={p?._id}
                    PositionX={p?.customizedComboRectangleId?.top}
                    PositionY={p?.customizedComboRectangleId?.left}
                    Height={p?.customizedComboRectangleId?.height}
                    Width={p?.customizedComboRectangleId?.width}
                    updateTotalPrice={() => {}}
                    setCustomizedCombination={() => {}}
                  />
                </div>
              );
            })}
        </div>
      </td>
      <td>
        <p style={{ fontSize: "17px", backgroundColor: "transparent" }}>
          {product?.Name}{" "}
        </p>
      </td>
      <td style={{ textAlign: "center", fontWeight: "600" }}>
        ₹ {data?.productAmount}
      </td>
      <td style={{ textAlign: "center", fontWeight: "600" }}>
        {data?.quantity}
      </td>
      <td style={{ textAlign: "right", fontWeight: "600" }}>
        {!isAdmin && (
          <Button
            onClick={() => setStatus(data)}
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
            href={`/admin/order/status/customizeComboProducts/${orderProducts?._id}/${data?._id}`}
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
            href={`/customized-combination/${product?._id}`}
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

export default CustomizedCombinationCard;
