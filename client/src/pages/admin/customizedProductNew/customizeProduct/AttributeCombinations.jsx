import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import ParameterModel from "./ParameterModel";
import ParameterModel from "../../../../components/ParameterModel/ParameterModel";
import { fetchAllParametersByAttributeId } from "../../../../redux/slices/parameterSlice";
import { REACT_APP_URL } from "../../../../config";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const AttributeCombinations = ({ optionvalue, setCombination }) => {
  let { loading, parameters } = useSelector((state) => state.parameters);

  const [allParameters, setAllParameters] = useState([]);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const fetchAllParameterByAttributeId = (id) => {
    dispatch(fetchAllParametersByAttributeId(id));
    setOpen(true);
  };

  useEffect(() => {
    if (loading === "fulfilled" && parameters) {
      setAllParameters(parameters);
    }
  }, [loading, parameters]);

  const selectedVarient = optionvalue.combinations[0];

  return (
    <>
      <ParameterModel
        parameters={allParameters}
        setOpen={setOpen}
        selectedVarientCombination={optionvalue}
        open={open}
        selectedVarient={selectedVarient}
        setCombination={setCombination}
      />

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* {console.log("selectedVarient", selectedVarient)} */}
          {selectedVarient && (
            <>
              <div className="image-area ProductDetailsAttributeDivMobileView">
                <img
                  className="ProductDetailsAttributeImageMobileView"
                  src={`${REACT_APP_URL}/images/parameter/${selectedVarient?.parameterId?.profileImage}`}
                  alt="Preview"
                />
                <button
                  className="AttributeImageRemove-image"
                  type="button"
                  style={{ display: "inline", padding: "0px" }}
                  onClick={() =>
                    fetchAllParameterByAttributeId(
                      selectedVarient?.attributeId?._id
                    )
                  }
                >
                  <ChangeCircleIcon style={{ fontSize: "20px" }} />
                </button>
              </div>
              <br />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttributeCombinations;
