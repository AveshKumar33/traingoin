import React, { useState, useEffect } from "react";
import homelogo from "../../assets/Image/RALINGOBlack.png";
import SliderImg1 from "../../assets/Image/Slider11.jpg";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { axiosInstance } from "../../config";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackgroundImageLightLeft from "../../assets/Image/BackgroundImageLightLeft.png";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import "./MainFooter.css";
import {
  faFacebook,
  faLinkedin,
  faPinterest,
  faYoutube,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const MainFooter = () => {
  const [rootCollection, setRootCollection] = useState([]);
  useEffect(() => {
    const getAllRootCollections = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/api/collection/getRootCollection"
        );

        if (data?.success) {
          setRootCollection(data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllRootCollections();
  }, []);

  return (
    <>
      <div
        className="row"
        style={{
          backgroundImage: `url(${BackgroundImageLightLeft})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="col-lg-4" style={{ paddingTop: "30px" }}>
          <center>
            <img src={homelogo} style={{ height: "12vh" }}></img>
          </center>
          <p
            className="Footer1sectionstyle"
            style={{ textAlign: "justify", color: "#6B6B83" }}
          >
            Railingo offers a one-stop solution for all customizable
            architectural metal products. With manufacturing capabilities in
            facade, doors, windows, railings, and other metal products, we boast
            specialized machinery and a dedicated design team.
            <br></br>
            We prefer collaborating with architects, interior designers, and
            builders.
          </p>
        </div>
        <div className="col-lg-2 Footer2sectionstyle">
          <b style={{ fontSize: "18px" }}>Information</b>
          <br></br>
          <br></br>
          <a
            href="/AboutUs"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; About Railingo
          </a>
          <br></br>
          <a
            href="/CompletedProject"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Completed Project
          </a>
          {/* <br></br>
          <a
            href="/ExperienceCenters"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Experience Centers
          </a>
          <br></br>
          <a
            href="#"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Find a Studio
          </a> */}
          <br></br>
          <a
            href="/PartnerWithUs"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Partner With Us
          </a>
          <br></br>
          <a
            href="/Exibhitions"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Exibhitions
          </a>

          <br></br>
          <a
            href="/PrivacyPolicy"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Privacy Policy
          </a>
          <br></br>
          <a
            href="/TermsandCondition"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Terms & Conditions
          </a>
          <br></br>
          <a
            href="/CancelationPolicy"
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Cancelation Policy
          </a>
        </div>
        {/* <div className="col-lg-2" style={{ padding: "30px 0px 0px 0px" }}>
          <b style={{ fontSize: "18px", backgroundColor:"#475B52", color:"#fff" }}>Customer Service</b>
          <br></br>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            Support Center
          </span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            Returns & Refunds
          </span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            Shipping Guide
          </span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            Design Services
          </span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>Financing</span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            About COVID-19
          </span>
          <br></br>
          <span style={{ color: "#6B6B83", fontSize: "15px" }}>
            Track Order
          </span>
        </div> */}

        <div className="col-lg-3 Footer3sectionstyle">
          <b style={{ fontSize: "18px" }}>Contact Us</b>
          {/* <br></br>
          <br></br>
          <a
            style={{
              color: "#6B6B83",
              fontSize: "15px",
              border: "1px solid #6B6B83",
              padding: "7px 12px 7px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Customer Service
          </a> */}
          <br></br> <br></br>
          <p>
            <span
              style={{ fontWeight: "600", fontSize: "16px", color: "#000" }}
            >
              <IoIosCall style={{ fontSize: "16px," }} /> &nbsp;&nbsp;
            </span>
            <Link
              to="tel:+918755999395"
              target="_blank"
            >
            <span style={{ fontSize: "14px", color: "#6B6B83" }}>
              +91 8755999395
            </span>
            </Link>
          </p>
          <p>
            <span
              style={{ fontWeight: "600", fontSize: "16px", color: "#000" }}
            >
              <MdEmail style={{ fontSize: "16px," }} />
              &nbsp;&nbsp;
            </span>
            <Link
              to="mailto:info@railingo.com"
              target="_blank"
            >
            <span style={{ fontSize: "14px", color: "#6B6B83" }}>
              info@railingo.com
            </span>
            </Link>
          </p>
          <p>
            <span
              style={{ fontWeight: "600", fontSize: "16px", color: "#000" }}
            >
              <FaLocationDot style={{ fontSize: "16px," }} />
              &nbsp;&nbsp;
            </span>
            <Link
              to="https://www.google.com/maps/search/?api=1&query=Hennur%2C+Kuvempu+Layout%2C+Kothanpur%2C+Bengaluru%2C+Karnataka%2C+560077%2C+India"
              target="_blank"
            >
              <span style={{ fontSize: "14px", color: "#6B6B83" }}>
                Hennur, Kuvempu Layout, Kothanpur, Bengaluru, Karnataka, 560077,
                India
              </span>
            </Link>
            <br></br>
            <br></br>
            <FontAwesomeIcon
              icon={faFacebook}
              style={{ color: "#1877F2", fontSize: "20px" }}
            />{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faLinkedin}
              style={{ color: "#0077B5", fontSize: "20px" }}
            />{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faPinterest}
              style={{ color: "#E60023", fontSize: "20px" }}
            />{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faYoutube}
              style={{ color: "#FF0000", fontSize: "20px" }}
            />{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ color: "#833AB4", fontSize: "20px" }}
            />{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FaXTwitter
              icon={faTwitter}
              style={{ color: "#000", fontSize: "20px", marginTop: "-10px" }}
            />
          </p>
        </div>

        <div className="col-lg-3 Footer4sectionstyle">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.348896439245!2d77.65838007381215!3d13.0770607125599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1a111eea125f%3A0x3df02291dcace749!2sHennur%20Main%20Rd%2C%20Bengaluru%2C%20Karnataka%20560077!5e0!3m2!1sen!2sin!4v1715686908143!5m2!1sen!2sin"
            className="MapStylingFooter"
            allowFullScreen=""
            loading="lazy"
            title="_titlr"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* <hr></hr>
        <p
          style={{
            textAlign: "center",
            fontWeight: "600",
            fontSize: "16px",
            color: "#000",
          }}
        >
          Designed & Developed By InnovateX
        </p> */}
      </div>
      {/* <div
        className="row"
        style={{
          background: `linear-gradient(to top, rgba(0, 0, 0), rgba(0, 0, 0, 0.10)), url(${SliderImg1})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "40vh",
        }}
      >
        <div className="parallel-image-section" style={{ paddingTop: "60px" }}>
          <div className="content">
            <center>
              <p style={{ color: "#fff", fontSize: "18px" }}>
                Connect with us for exclusive design tips, and more.<br></br>{" "}
                Follow us on social media or reach out via email for
                personalized assistance.
              </p>
              <FontAwesomeIcon
                icon={faFacebook}
                style={{ color: "#fff", fontSize: "20px" }}
              />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon
                icon={faLinkedin}
                style={{ color: "#fff", fontSize: "20px" }}
              />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon
                icon={faPinterest}
                style={{ color: "#fff", fontSize: "20px" }}
              />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon
                icon={faYoutube}
                style={{ color: "#fff", fontSize: "20px" }}
              />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon
                icon={faInstagram}
                style={{ color: "#fff", fontSize: "20px" }}
              />{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon
                icon={faTwitter}
                style={{ color: "#fff", fontSize: "20px" }}
              />
              <br></br>
              <br></br>
              <a href="/AboutUs">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  About Us
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/CompletedProject">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Completed Projects
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/ExperienceCenters">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Experience Centers
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/PartnerWithUs">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Partner With Us
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/Exibhitions">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Exibhitions
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/PrivacyPolicy">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Privacy Policy
                </span>
              </a>
              &nbsp;&nbsp;
              <a href="/TermsandCondition">
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#475B52",
                    padding: "7px 15px 7px 15px",
                    textTransform: "uppercase",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Terms & Conditions
                </span>
              </a>
              &nbsp;&nbsp;
            </center>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MainFooter;
