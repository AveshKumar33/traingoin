import { useState } from "react";
import { createEnquiry } from "../../redux/slices/enquirySlice";
import { useDispatch, useSelector } from "react-redux";
import { toastSuceess } from "../../utils/reactToastify";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaMobileScreenButton } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import BackgroundImageRight from "../../assets/Image/BackgroundImageRight.png";

const EnquiryForm = () => {
  const [formData, setformData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    message: "",
  });

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.enquiry);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createEnquiry(formData));

    if (loading === "fulfilled") {
      toastSuceess("Form Submitted Successfully");
      setformData({
        Name: "",
        Phone: "",
        Email: "",
        message: "",
      });
    }
  };

  return (
    <>
      <div
        className="row"
        style={{ backgroundColor: "#fff",marginTop:"-10px", paddingTop: "30px",backgroundImage: `url(${BackgroundImageRight})`,
        backgroundSize: "cover",
        backgroundPosition: "center", }}
      >
        <div className="container querysectionstyle">
          <div className="col-lg-6 querysectionstyle1">
            <h4 style={{ textAlign: "center", fontWeight:"600" }}>SEND YOUR QUERY</h4>
            <div className="modal__container" style={{ padding: 50 }}>
              <form onSubmit={handleSubmit}>
                <ul className="form-list">
                  <li className="form-list__row">
                    <label style={{fontSize:"14px"}}>Full Name</label>
                    <input
                      type="text"
                      name="Name"
                      required
                      className="queryinput"
                      value={formData.Name}
                      onChange={handleChange}
                    />
                  </li>
                  <li className="form-list__row">
                    <label style={{fontSize:"14px"}}>Phone Number</label>
                    <input
                      type="tel"
                      name="Phone"
                      required
                      className="queryinput"
                      value={formData.Phone}
                      onChange={handleChange}
                    />
                  </li>
                  <li className="form-list__row">
                    <label style={{fontSize:"14px"}}>Email Address</label>
                    <input
                      type="email"
                      name="Email"
                      required
                      className="queryinput"
                      value={formData.Email}
                      onChange={handleChange}
                    />
                  </li>
                  <li className="form-list__row">
                    <label style={{fontSize:"14px"}}>Leave a Message</label>
                    <textarea
                      type="text"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </li>

                  <li>
                    <button type="submit" className="button" style={{backgroundColor:"#475B52"}}>
                      Submit
                    </button>
                  </li>
                </ul>
              </form>
            </div>{" "}
            {/* END: .modal */}
          </div>
          <div className="col-lg-1" style={{ float: "left"}}>&nbsp;</div>
          <div className="col-lg-4 contactinfodiv">
            <h4 style={{ textAlign: "center", fontWeight:"600" }}>CONTACT INFO</h4>
            <div style={{marginTop:"50px"}}>
            <b style={{fontSize:"20px", textTransform:"uppercase", color:"#475B52"}}><FaLocationDot />&nbsp;&nbsp;</b><span style={{fontSize:"18px", textAlign:"justify"}}>Hennur, Kuvempu Layout, Kothanpur, Bengaluru, Karnataka, 560077, India</span>
            <br></br>
            <br></br>
            <b style={{fontSize:"20px", textTransform:"uppercase", color:"#475B52"}}><IoMdMail />&nbsp;&nbsp;</b><span style={{fontSize:"18px", textAlign:"justify"}}>info@railingo.com, support@railingo.com</span>
            <br></br>
            <br></br>
              <b style={{fontSize:"20px", textTransform:"uppercase", color:"#475B52"}}><FaMobileScreenButton />&nbsp;&nbsp;</b><span style={{fontSize:"18px", textAlign:"justify"}}> +91 8755999395</span>
              <br></br>
            <br></br>
              <b style={{fontSize:"20px", textTransform:"uppercase", color:"#475B52"}}><IoIosTime />&nbsp;&nbsp;</b><span style={{fontSize:"18px", textAlign:"justify"}}> Working Hours : 9 am - 6 pm</span>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryForm;
