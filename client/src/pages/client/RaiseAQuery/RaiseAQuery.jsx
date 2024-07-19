import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import { createRaiseAQuery } from "../../../../src/redux/slices/raiseAQuerySlice";
import { useDispatch, useSelector } from "react-redux";
import { toastError } from "../../../utils/reactToastify";
const RaiseAQuery = ({
  showRaiseAQueryModal,
  RaiseModalClose,
  product = {},
  productCombination = {},
  architectId = null,
}) => {
  const { message: resMessage, loading } = useSelector(
    (state) => state.raiseQuery
  );

  const dispatch = useDispatch();
  const [formdata, setformdata] = useState({
    fullname: "",
    phone: "",
    email: "",
    message: "",
    Address: "",
    gstNo: "",
    productCombination: null,
  });

  const { fullname, phone, email, Address, message, gstNo } = formdata;

  const onChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "gstNo") {
      if (value?.length <= 15)
        setformdata((prevState) => ({
          ...prevState,
          [name]: value.toUpperCase(),
        }));
      return;
    }
    setformdata((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (gstNo && gstNo.trim().length !== 15) {
      toastError(`Gst No must have fifteen digits!`);
      return;
    }
    dispatch(
      createRaiseAQuery({
        Name: fullname,
        Email: email,
        productCombination: productCombination,
        MobNumber: phone,
        Message: message,
        Address,
        gstNo,
        architectId,
      })
    );
    if (loading === "fulfilled") {
      alert(resMessage);
      setformdata({
        fullname: "",
        phone: "",
        email: "",
        message: "",
        Address: "",
        gstNo: "",
        productCombination: null,
      });
      RaiseModalClose();
    }
  };
  const isMobile = window.innerWidth <= 768;
  const modalWidth = isMobile ? "90%" : "35%";

  return (
    <Modal
      handleClose={RaiseModalClose}
      width={modalWidth}
      show={showRaiseAQueryModal}
      left="50%"
    >
      <div style={{ padding: "2rem" }}>
        <h4 className="text-center">Price Request</h4>
        <h6>Contact us with your queries.</h6>
        <div className="row ">
          <div style={{ fontWeight: "600" }}>
            Product Name :{" "}
            <span style={{ color: "GrayText" }}>{product?.ProductName}</span>
          </div>
          <div className="col-lg-12 col-md-12 col-12  bg-white rounded">
            <div className="">
              <form className="pb-3" method="post" onSubmit={onSubmit}>
                <div className="form-row my-1">
                  <div className="col">
                    <input
                      type="text"
                      className=" form-control  py-2"
                      name="fullname"
                      value={fullname}
                      placeholder="Full Name"
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row my-1">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control  py-2"
                      name="phone"
                      value={phone}
                      placeholder="Mob Number"
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row my-1">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control  py-2"
                      name="email"
                      value={email}
                      placeholder="Email"
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row my-1">
                  <div className="col">
                    <input
                      type="text"
                      className=" form-control  py-2"
                      name="Address"
                      value={Address}
                      placeholder="Address"
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row my-1">
                  <div className="col">
                    <input
                      type="text"
                      className=" form-control  py-2"
                      name="gstNo"
                      value={gstNo}
                      placeholder="Gst No"
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="form-row my-1">
                  <div className="col">
                    <textarea
                      className="form-control  py-2"
                      placeholder="Message"
                      id="floatingTextarea2"
                      name="message"
                      value={message}
                      onChange={onChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <input
                  className="btn rounded col-lg-12 col-md-12 col-12 px-5 mt-2"
                  type="submit"
                  value="Submit"
                  style={{
                    color: "white",
                    backgroundColor: "#475B52",
                  }}
                  id="submit"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RaiseAQuery;
