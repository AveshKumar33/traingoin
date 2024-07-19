import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { axiosInstance } from "../../../config";

const createOption = (ele) => ({
  label: ele.tagName,
  value: ele._id,
});

const AddFilterTag = ({ data, AddTagData, selectedData = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);

  const handleCreate = async (inputValue) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/collection-tag",
        { tagName: inputValue, collectionFilterId: data?._id },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (response?.data?.success) {
        const newOption = createOption(response?.data?.data);
        setIsLoading(false);
        setOptions((prev) => [...prev, newOption]);
        AddTagData(data?.filterName, [...value, newOption]);
        setValue((prev) => [...prev, newOption]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const option = data?.collectionTagIds?.map((ele) => createOption(ele));
    setOptions(option);

    if (selectedData?.length > 0) {
      const selected = selectedData
        ?.filter((product) => product?.data[0]?._id === data?._id)
        .flatMap((val) => val?.data || []);

      if (selected?.length > 0) {
        const selectedValue = selected?.map((val) => ({
          label: val?.collectionFilterTags?.tagName,
          value: val?.collectionFilterTags?._id,
        }));

        setValue(selectedValue);
      }
    }
  }, [data, selectedData]);

  useEffect(() => {
    AddTagData(data?.filterName, value);
  }, [value]);

  // useEffect(() => {
  //   if (TagsData.length > 0) {
  //     const data = TagsData.map((tag) => createOption(tag));
  //     setValue(data);
  //   }
  // }, [TagsData]);

  return (
    <div>
      <label className="form-label" htmlFor="Description">
        {data.filterName}
      </label>
      <CreatableSelect
        isClearable
        isMulti
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={(newValue) => setValue(newValue)}
        onCreateOption={handleCreate}
        options={options}
        value={value}
      />
    </div>
  );
};

export default AddFilterTag;
