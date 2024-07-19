import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./RoomIdea.css";

const createOption = (ele) => ({
  label: ele.tagName,
  value: ele._id,
  filterName: ele.tagName,
});

const UserFilterTag = ({
  data,
  AddTagData,
  tagsValue,
  setTagsValue,
  setProducts,
  setPage,
  clearChildState,
  selec,
}) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    const option = data?.collectionTagIds?.map((ele) => createOption(ele));
    const selectedOption = [];
    data?.collectionTagIds.forEach((tag) => {
      const exist = selec.includes(tag?._id);
      if (exist) {
        selectedOption.push(tag);
      }
    });

    if (option?.length > 0) {
      setOptions(option);
    }

    if (selectedOption?.length > 0) {
      const value = selectedOption?.map((ele) => createOption(ele));
      setValue([...value]);
    }
  }, [data, selec]);

  useEffect(() => {
    if (clearChildState) {
      setValue([]);
    }
  }, [clearChildState, setTagsValue]);

  // useEffect(() => {
  //   setValue(() => tagsValue?.map((tags) => tags?.filterName === data?.Name));
  // }, [tagsValue, data?.Name]);

  return (
    <>
      <div className="col-lg-12">
        <label className="form-label" htmlFor="Description">
          {data.filterName}
        </label>
        <Select
          isClearable
          isMulti
          closeMenuOnSelect={false}
          onChange={(newValue) => {
            AddTagData(data.filterName, newValue);
            // setTagsValue(newValue);
            // window.scrollTo(0, 0);
            setValue(newValue);
          }}
          options={options}
          value={value}
          styles={{ container: (provided) => ({ ...provided, width: "100%" }) }}
        />
      </div>
    </>
  );
};

export default UserFilterTag;
