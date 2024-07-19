import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import { returnSearchArrOfCollection } from "../../../utils/usefullFunction";

const MultiCollection = ({
  // eslint-disable-next-line react/prop-types
  Options = [],
  // eslint-disable-next-line react/prop-types
  SelectedCollectionType,
  // eslint-disable-next-line react/prop-types
  setSelectedCollectionType,
  // eslint-disable-next-line react/prop-types
  index,
  // eslint-disable-next-line react/prop-types
  OptionsValue,
  // eslint-disable-next-line react/prop-types
  view, // eslint-disable-next-line react/prop-types
  IsFilter = false, // eslint-disable-next-line react/prop-types
  col = "col-md-4 align-items-center",
}) => {
  const [CollectionType, setCollectionType] = useState(OptionsValue ?? "");
  const [IsFirstCall, setIsFirstCall] = useState(true);

  const getDataCollectionType = async () => {
    const selectedObj = SelectedCollectionType;

    if (!CollectionType) {
      selectedObj[index]["value"] = "";
      selectedObj.length = index + 1;
      return setSelectedCollectionType([...selectedObj]);
    } else {
      selectedObj[index]["value"] = CollectionType;
      selectedObj.length = index + 1;
    }
    const returnSearchArr = returnSearchArrOfCollection(selectedObj);

    try {
      const {
        data: { data = [] },
      } = await axiosInstance.post(`/api/collection/getChildCollection`, {
        allChild: returnSearchArr,
      });

      if (data && data?.length !== 0) {
        return setSelectedCollectionType([...selectedObj, { data, value: "" }]);
      } else {
        return setSelectedCollectionType([...selectedObj]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (IsFirstCall) {
      return setIsFirstCall(false);
    } else {
      getDataCollectionType();
    }
  }, [CollectionType]);

  return (
    <>
      {
        <div className={col}>
          <label>
        Child Collection {index?index:""}
          </label>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              setCollectionType(e.target.value);
            }}
            key={OptionsValue}
            value={CollectionType}
            // style={IsFilter ? { width: "15vw" } : {}}
            required={index === 0 ? true : false}
            disabled={view}
          >
            <option value="">--Collection Type--</option>
            {Options &&
              Options?.data &&
              Options?.data.length > 0 &&
              Options?.data.map((data) => (
                <option
                  value={data._id}
                  key={data._id}
                >{`${data.title}`}</option>
              ))}
          </select>
        </div>
      }
    </>
  );
};

export default MultiCollection;
