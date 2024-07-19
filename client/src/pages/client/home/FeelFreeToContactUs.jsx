import React, { useState } from "react";
import { axiosInstance } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

const FeelFreeToContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobNumber: "",
  });
  const { name, email, mobNumber } = formData;
  async function submitFeelFreeToContactUs(payload) {
    try {
      const { data } = await axiosInstance.post(
        `/api/feel-free-to-contact-us`,
        payload
      );
      if (data.success) {
        toastSuceess(data?.message);
        setFormData({ name: "", email: "", mobNumber: "" });
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    submitFeelFreeToContactUs(formData);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="FeelFreeFormStyle">
          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
            style={{ flex: 1, marginLeft: "10px" }}
          />
        </div>
        &nbsp; &nbsp;
        <div className="FeelFreeFormStyle">
          <input
            type="email"
            className="form-control"
            placeholder="Your Email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            style={{ flex: 1, marginLeft: "10px" }}
          />
        </div>
        &nbsp; &nbsp;
        <div className="FeelFreeFormStyle">
          <input
            type="text"
            className="form-control"
            id="Mobile"
            placeholder="Your Mobile"
            name="mobNumber"
            value={mobNumber}
            onChange={handleChange}
            required
            style={{ flex: 1, marginLeft: "10px" }}
          />
        </div>
        &nbsp; &nbsp;
        <div className="FeelFreeFormButton">
          <input
            type="submit"
            className="btn btn-info"
            value="Submit"
            style={{
              cursor: "pointer",
              backgroundColor: "#475B52",
              border: "none",
              color: "#fff",
            }}
          />
        </div>
      </form>
    </>
  );
};

export default FeelFreeToContactUs;
