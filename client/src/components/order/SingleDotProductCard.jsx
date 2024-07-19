import React from "react";

import "./styles.css";
import { REACT_APP_URL } from "../../config";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const SingleDotProductCard = ({
  product,
  setStatus,
  orderProducts,
  isAdmin,
}) => {
  return (
    <tr>
      <td>
        <div className="ImageContainer" style={{ position: "relative" }}>
          {product?.dotProductImageIds[0]?.image && (
            <Link to={`/room-idea/${product?.singleDotProductId}`}>
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/dotimage/${product?.dotProductImageIds[0]?.image}`}
                className="card-img-top RoomIdeaImageStyle"
                alt={product?.name}
                style={{ height: "15vh" }}
              />
            </Link>
          )}

          {/* {product?.dotProductImageIds[0]?.dots?.map((p, i) => {
            return (
              <React.Fragment key={p._id}>
                <div
                  className="Dot fa fa-circle text-danger-glow blink"
                  key={p._id}
                  // onClick={() => handleModal(i, p.productId)}
                  style={{
                    left: `${p.positionX}%`,
                    top: `${p.positionY}%`,
                  }}
                ></div>
                <span
                  className="blink"
                  style={{
                    left: `${p.positionX + 4}%`,
                    top: `${p.positionY + 1}%`,
                    position: "absolute",
                    backgroundColor: "#3e6554",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "3px",
                    border: "1px solid #fff",
                  }}
                >
                  <p style={{ color: "#fff" }}>
                    {p?.productId?.ProductName.slice(0, 10)}
                  </p>
                </span>
              </React.Fragment>
            );
          })} */}
        </div>
      </td>
      <td>
        <p style={{ fontSize: "17px", backgroundColor: "transparent" }}>
          {product?.name}{" "}
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
            onClick={() => setStatus(product)}
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
            href={`/admin/order/status/singleDotProducts/${orderProducts?._id}/${product?._id}`}
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
            href={`/room-idea/${product?.singleDotProductId}`}
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

export default SingleDotProductCard;
