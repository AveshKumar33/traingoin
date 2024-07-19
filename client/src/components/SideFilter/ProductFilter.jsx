import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductFilter = ({
  products,
  setfilters,
  filters,
  setsearchproductByName,
}) => {
  const { collectionname } = useParams();

  const [productfilter, setproductfilter] = useState([]);

  useEffect(() => {
    const getattribute = getallattribute(products);
    setproductfilter(getattribute);
  }, [collectionname]);

  const getallattribute = (products) => {
    const attributeMap = new Map();
    for (const product of products) {
      for (const attribute of product?.singleProductId.attribute) {
        const attributeName = attribute.Name;

        if (attributeMap.has(attributeName)) {
          const existingAttribute = attributeMap.get(attributeName);

          // console.log("existingAttribute",existingAttribute,attributeMap)

          // Commenting for better

          // existingAttribute.values.push(...attribute.attributeItems);
        } else {
          attributeMap.set(attributeName, {
            name: attributeName,
            values: [...attribute.OptionsValue],
          });
        }
      }
    }

    const aggregatedAttributes = Array.from(attributeMap.values());

    return aggregatedAttributes;
  };

  const handleFilter = (e) => {
    setfilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilter = () => {
    setfilters({});
  };

  return (
    <>
      <br></br>
      <button className="btn btn-primary" onClick={resetFilter}>
        Reset Filter
      </button>

      <div className="mt-3">
        {/* <h6>Search Product by Name</h6> */}
        <input
          type="text"
          className="form-control my-2"
          onChange={(e) => setsearchproductByName(e.target.value)}
          placeholder="Enter Product Name..."
        />
        {/* <button className="btn btn-primary">Search</button> */}
      </div>
      <br></br>

      {productfilter &&
        productfilter.map((p) => {
          return (
            <>
              <select
                className="form-select"
                aria-label="Default select example"
                key={p.name}
                name={p.name}
                onChange={handleFilter}
                value={filters[p.name] || ""}
              >
                <option key={p.name} value={""}>
                  Select {p.name} Type
                </option>
                {p.values.map((value) => (
                  <>
                    <option key={p.value} value={value.Name}>
                      {value.Name}
                    </option>
                  </>
                ))}
              </select>
              <br></br>
            </>
          );
        })}
    </>
  );
};

export default ProductFilter;
