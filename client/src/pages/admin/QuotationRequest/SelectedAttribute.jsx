import React from "react";

import { REACT_APP_URL } from "../../../config";

const SelectedAttribute = ({ optionvalue }) => {
  return (
    <tr>
      <td>{optionvalue?.attributeId?.PrintName}</td>
      <td>
        <b>{optionvalue?.parameterId?.name}</b>
      </td>
      <td style={{ textAlign: "right" }}>
        <img
          className="ProductDetailsAttributeImageMobileView"
          src={`${REACT_APP_URL}/images/parameter/${optionvalue?.parameterId?.profileImage}`}
          alt="Preview"
          width="30"
          height="30"
        />
      </td>
    </tr>
  );
};

export default SelectedAttribute;
