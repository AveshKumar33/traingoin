import React, { useEffect, useState } from "react";
import "./FilterStickySidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWishlistProductCount } from "../../redux/slices/newWishlistSlice";
import { TbFilterSearch } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import UserFilterTag from "../../pages/client/roomideas/UserFilterTag";

const FilterStickySidebar = ({
  FiltersData,
  AddTagData,
  tagsValue,
  setTagsValue,
  setProducts,
  setPage,
  selec,
  clearChildState,
  setSearchFilterData,
  setClearChildState,
  Tags,
  searchFilterData,
  setTags,
}) => {
  const { userdetails } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(getWishlistProductCount());
    }
  }, [userdetails, dispatch]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    const tagArrays = Object.values(Tags);
    const arr = tagArrays.flat();

    if (arr?.length > 0) {
      arr.forEach((id) => {
        queryParams.append("objectId", id);
      });

      navigate({ search: queryParams.toString() });
      setPage(1);
      setProducts([]);
      setSearchFilterData([...arr]);
    }
  };

  const clearSearch = () => {
    if (searchFilterData?.length !== 0) {
      setClearChildState(true);
      setPage(1);
      setProducts([]);
      setSearchFilterData([]);
      setTags({});
      setTimeout(() => {
        setClearChildState(false);
      }, 0);
    }
  };

  return (
    <>
      <div className="sticky-container1" id="Floating">
        <ul className="sticky1 FloatingulClass1">
          <li className="Hoverclass1" onClick={toggleSidebar} title="Filter">
            <TbFilterSearch />
          </li>
        </ul>
      </div>
      {sidebarOpen && (
        <div
          className="sidebarMenu"
          style={{ left: "0", padding: "70px 30px 10px 30px", zIndex: "9999" }}
        >
          <center>
            <span
              style={{
                fontSize: "16px",
                textAlign: "center",
                backgroundColor: "#475B52",
                color: "#fff",
                padding: "10px 40px 10px 40px",
                fontFamily: "Macondo, cursive",
              }}
            >
              Filters
            </span>
          </center>
          <br></br>
          {FiltersData &&
            FiltersData.length > 0 &&
            FiltersData.map((ele, index) => (
              <div
                className="col-lg-12 FilterStyle"
                key={index}
                style={{ float: "left" }}
              >
                <UserFilterTag
                  data={ele}
                  AddTagData={AddTagData}
                  tagsValue={tagsValue}
                  setTagsValue={setTagsValue}
                  setProducts={setProducts}
                  setPage={setPage}
                  selec={selec}
                  clearChildState={clearChildState}
                />
              </div>
            ))}
          <div
            className="col-lg-12"
            style={{ float: "left", paddingTop: "28px" }}
          >
            <button
              className="btn btn-primary m-1"
              type="button"
              onClick={handleSearch}
              style={{ backgroundColor: "#475B52", border: "none" }}
            >
              Search
            </button>
            <button
              className="btn btn-warning m-1"
              type="button"
              onClick={clearSearch}
              style={{ border: "none" }}
            >
              Clear
            </button>
          </div>
          <div className="close-btn" onClick={toggleSidebar}>
            <FaTimes className="close-icon" />
          </div>
        </div>
      )}
    </>
  );
};
export default FilterStickySidebar;
