import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { toastError } from "../../utils/reactToastify";
import AdminVarientImage from "../adminvarientImage/AdminVarientImage";
import {
  getAttriutePrice,
  getAttriutePriceBack,
} from "../../utils/varientimge/getAttributePrice";

const SameAsFrontVarient = ({
  attribute,
  varient,
  attributePosition,
  price,
  name,
}) => {
  return (
    <>
      {varient &&
        varient.length > 0 &&
        varient.map((p) => (
          <>
            <SameAsFrontlist
              p={p}
              attribute={attribute}
              attributePosition={attributePosition}
              price={price}
              name={name}
            />
          </>
        ))}
    </>
  );
};

const SameAsFrontlist = ({ p, attribute, attributePosition, price, name }) => {
  console.log(
    "attribute:",
    attribute,
    "p:-",
    p,
    "attributePosition:-",
    attributePosition,
    "check this 42"
  );
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "3px 0px",
        }}
      >
        <div>
          {Object.entries(p).map((p, i) => {
            return <span key={p}>{p[1]}/</span>;
          })}
        </div>

        <AdminVarientImage
          key={p}
          attribute={attribute}
          varient={p}
          attributePosition={attributePosition}
        />

        <div>
          {price + getAttriutePrice(attribute, p, attributePosition, name)}
        </div>
      </div>
    </>
  );
};

export default SameAsFrontVarient;
