import React, { useState } from "react";
import { toastSuceess } from "../../utils/reactToastify";
import { createEnquiry } from "../../redux/slices/enquirySlice";
import { useDispatch, useSelector } from "react-redux";
import { createCatalogue } from "../../redux/slices/catalogueSlice";
import pdf from "../../assets/pdf/dummy.pdf";

const Catalogue = () => {
  const [formData, setformData] = useState({
    Name: "",
    Email: "",
  });

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.catalogue);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createCatalogue(formData));

    if (loading === "fulfilled") {
      toastSuceess("Form Submitted Successfully");
      window.location.href = pdf;
      setformData({
        Name: "",
        Email: "",
      });
    }
  };

  return (
    <>
      <div className="row CatalogueSectionStyle">
        <div className="row CatalogueSectionStyle1">
          <div className="col-lg-5" />
          <div className="col-lg-6 formdesign">
            <center>
              <form
                onSubmit={handleSubmit}
                target="_blank"
                className="subscribe-form d-block d-md-flex align-items-center CatalogueSectionStyle2"
              >
                <input
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="form-control me-0 me-md-2 mb-2 mb-md-0"
                  placeholder="Your Name "
                  required
                />
                <input
                  type="email"
                  name="Email"
                  className="form-control me-0 me-md-2 mb-2 mb-md-0"
                  placeholder="Your Email*"
                  required
                  value={formData.Email}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  name="submit"
                  formTarget="_blank"
                  className="btn btn-default w-100 w-md-auto"
                  style={{ backgroundColor: "#475B52", color: "#fff" }}
                >
                  Download
                </button>
              </form>
            </center>
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalogue;
