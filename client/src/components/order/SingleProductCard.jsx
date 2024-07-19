import React from "react";
import "./styles.css";
import { REACT_APP_URL } from "../../config";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const SingleProductCard = ({ product, orderProducts, setStatus, isAdmin }) => {
  return (
    <tr>
      <td>
        <Link
          to={`/product/${product?.singleProductId?.Collection[0]?.url}/${
            product?.singleProductId?.Urlhandle
          }?productType=${"singleProducts"}&orderId=${
            orderProducts?._id
          }&orderItemId=${product?._id}`}
        >
          <img
            src={`${REACT_APP_URL}/images/product/${product?.image}`}
            alt="img25"
            style={{ height: "15vh" }}
          />
        </Link>
      </td>
      <td>
        <p style={{ fontSize: "17px", backgroundColor: "transparent" }}>
          {product?.singleProductId?.ProductName}
        </p>
      </td>
      <td style={{ textAlign: "center", fontWeight: "600" }}>
        ₹ {product?.productAmount}
      </td>

      <td style={{ textAlign: "center", fontWeight: "600" }}>
        {product?.quantity}
      </td>
      <td style={{ textAlign: "right", fontWeight: "600" }}>
        {!isAdmin && (
          <Button
            onClick={() => {
              setStatus(product);
              // handleOpen()
            }}
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
            href={`/admin/order/status/singleProducts/${orderProducts?._id}/${product?._id}`}
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
            href={`/product/${product?.singleProductId?.Collection[0]?.url}/${
              product?.singleProductId?.Urlhandle
            }?productType=${"singleProducts"}&orderId=${
              orderProducts?._id
            }&orderItemId=${product?._id}`}
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

export default SingleProductCard;
