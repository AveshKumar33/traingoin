import React, { useState, useEffect } from "react";
import Select from "react-select";

import { Switch } from "@mui/material";

const ProductSetting = ({
  attributeData,
  Setting,
  showField,
  setattributePosition,
}) => {
  // console.log({
  //   attributeData,
  //   AttributePositionName,
  //   Setting,
  //   productId,
  //   showField,
  // });

  const [positionX, setpositionX] = useState(0);
  const [positionY, setpositionY] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [SelectedPosition, setSelectedPosition] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  // useEffect(() => {
  //   if (Setting.length > 0 && attributeData) {
  //     setSettingData(Setting);
  //   }
  // }, [Setting]);

  // useEffect(() => {
  //   const hasKey = Object.keys(value);
  //   if (hasKey.length > 0) {
  //     const [key, attribute] = hasKey[0].split("_");
  //     const [keyValue] = Object.values(value);

  //     setattributePosition((prevState) => {
  //       const attributeIndex = prevState.findIndex(
  //         (ele) => ele.attributeId === attribute
  //       );

  //       if (attributeIndex !== -1) {
  //         return prevState.map((ele, index) =>
  //           index === attributeIndex ? { ...ele, [key]: keyValue } : ele
  //         );
  //       } else {
  //         return [...prevState, { attributeId: attribute, [key]: keyValue }];
  //       }
  //     });
  //   }
  // }, [value, setattributePosition]);

  useEffect(() => {
    if (Setting && Setting?.length > 0 && attributeData) {
      const data = Setting.find(
        (ele) => ele?.attributeId === attributeData?.attributeId
      );

      setpositionY(data?.positionY || 0);
      setpositionX(data?.positionX || 0);
      setIsShow(data?.isShow || false);

      if (data?.parameterId) {
        setSelectedParameter(data?.parameterId);
      } else {
        setSelectedParameter(null);
      }
      if (data?.positionId) {
        setSelectedPosition(data?.positionId);
      } else {
        setSelectedPosition(null);
      }
    }
  }, [Setting, attributeData]);

  const handleChange = (value) => {
    // if (positionY > 100 || positionX > 100) {
    //   return alert("Value Can't be greater than 100");
    // }

    const hasKey = Object.keys(value);
    if (hasKey.length > 0) {
      const [key, attribute] = hasKey[0].split("_");
      const [keyValue] = Object.values(value);

      setattributePosition((prevState) => {
        if (prevState?.length > 0) {
          const attributeIndex = prevState.findIndex(
            (ele) => ele.attributeId === attribute
          );

          if (attributeIndex !== -1) {
            // Correct way to update an object property
            return prevState.map((ele, index) =>
              index === attributeIndex ? { ...ele, [key]: keyValue } : ele
            );
          } else {
            return [...prevState, { attributeId: attribute, [key]: keyValue }];
          }
        } else {
          return [{ attributeId: attribute, [key]: keyValue }];
        }
      });
    }
  };

  return (
    <>
      <td>
        <Select
          options={attributeData.parameters}
          isClearable
          name={`${showField}_${attributeData.attributeId}`}
          id={`${showField}_${attributeData.attributeId}`}
          getOptionLabel={(option) =>
            `${option.name} (${option?.attributeCategoryId?.Name})`
          }
          getOptionValue={(option) => option._id}
          // onChange={(e) => {
          //   setSelectedParameter(e);
          //   setValue({ [`parameterId_${attributeData.attributeId}`]: e });
          // }}
          onChange={(e) => {
            handleChange({
              [`parameterId_${attributeData.attributeId}`]: e,
            });

            setSelectedParameter(e);
          }}
          value={selectedParameter || ""}
        />
      </td>
      <td>
        <Select
          options={attributeData.positions}
          id={`${showField}_${attributeData.attributeData?.createdAt}`}
          name={`${showField}_${attributeData.attributeData?.createdAt}`}
          isClearable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option._id}
          onChange={(e) => {
            setSelectedPosition(e);
            handleChange({
              [`positionId_${attributeData.attributeId}`]: e,
            });
          }}
          // onChange={(e) => {
          //   setSelectedPosition(e);
          //   setValue({ [`positionId_${attributeData.attributeId}`]: e });
          // }}
          value={SelectedPosition || ""}
        />
      </td>
      <td>
        {/* <form onSubmit={handleSubmitLeft}> */}
        <input
          className="form-control"
          type="number"
          name={`${showField}_positionX`}
          id={`${showField}_positionX`}
          placeholder="Enter left Position"
          value={positionX}
          // onChange={(e) => {
          //   setpositionX(e.target.value);
          //   setValue({
          //     [`positionX_${attributeData.attributeId}`]: e.target.value,
          //   });
          // }}

          onChange={(e) => {
            if (e.target.value > 100) {
              setpositionY(100);
              handleChange({
                [`positionX_${attributeData.attributeId}`]: 100,
              });
              return alert("Value Can't be greater than 100");
            }
            setpositionX(e.target.value);
            handleChange({
              [`positionX_${attributeData.attributeId}`]: e.target.value,
            });
          }}
        />
        {/* </form> */}
      </td>
      <td>
        {/* <form onSubmit={handleSubmitTop}> */}
        <input
          className="form-control"
          type="number"
          value={positionY}
          name={`${showField}_positionY`}
          id={`${showField}_positionY`}
          placeholder="Enter Top Position"
          // onChange={(e) => {
          //   setpositionY(e.target.value);
          //   setValue({
          //     [`positionY_${attributeData.attributeId}`]: e.target.value,
          //   });
          // }}

          onChange={(e) => {
            if (e.target.value > 100) {
              setpositionY(100);
              handleChange({
                [`positionY_${attributeData.attributeId}`]: 100,
              });
              return alert("Value Can't be greater than 100");
            }
            setpositionY(e.target.value);
            handleChange({
              [`positionY_${attributeData.attributeId}`]: e.target.value,
            });
          }}
        />
        {/* </form> */}
      </td>
      <td className="text-center">
        {/* <form
                onSubmit={handleQuantity}
                className="text-center"
              > */}
        <Switch
          checked={isShow}
          // onChange={(e) => {
          //   setIsShow(e.target.checked);
          //   setValue({
          //     [`isShow_${attributeData.attributeId}`]: e.target.checked,
          //   });
          // }}

          onChange={(e) => {
            setIsShow(e.target.checked);
            handleChange({
              [`isShow_${attributeData.attributeId}`]: e.target.checked,
            });
          }}
        />
        {/* </form> */}
      </td>
    </>
  );
};

export default ProductSetting;
