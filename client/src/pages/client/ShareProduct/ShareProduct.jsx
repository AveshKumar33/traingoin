import React from "react";
import Modal from "../../../components/modal/Modal";
import copyImage from "./images/copy-link.svg";
import facebook from "./images/facebook.svg";
import gmail from "./images/gmail.svg";
import messenger from "./images/messenger.svg";
import textSms from "./images/text-sms.svg";
import twitter from "./images/twitter.svg";
import whatsapp from "./images/whatsapp.svg";
import "./SharedProduct.css";
import { Link } from "react-router-dom";
import { toastSuceess, toastError } from "../../../utils/reactToastify";
const ShareProduct = ({
  ProductName = "",
  showShareModal = false,
  ShareModalClose,
}) => {
  const copyTest = async () => {
    try {
      const textField = document.createElement("textarea");
      textField.value = window.location.href;
      document.body.appendChild(textField);
      textField.select();
      const isSuccessful = document.execCommand("copy");
      console.error("URL copied successfully: ", isSuccessful);
      textField.remove();
      if (isSuccessful) {
        toastSuceess("URL copied successfully");
      }
    } catch (error) {
      toastError("Failed to copy URL");
      console.error("Failed to copy URL: ", error);
    }
  };
  const isMobile = window.innerWidth <= 768;
  const modalWidth = isMobile ? "90%" : "35%";
  return (
    <Modal
      handleClose={ShareModalClose}
      width={modalWidth}
      show={showShareModal}
      // height="65%"
      left="50%"
    >
      <div style={{ padding: "2rem" }}>
        <h6>Share this product with friends and family</h6>
        <p className="pb-2">{ProductName}</p>
        <div className="share-link-container">
          <div className="share-link-item ">
            <div
              className="share-link-icon"
              onClick={() => copyTest()}
              style={{
                cursor: "pointer",
              }}
            >
              <img
                style={{
                  width: "32px",
                  height: "32px",
                }}
                loading="lazy"
                alt="_Copy_img"
                src={copyImage}
              />
              <p className="share-link-icon-text">Copy link</p>
            </div>
          </div>
          <div className="share-link-item ">
            <Link
              to={`mailto:support@railingo.com?body=${window.location.href}`}
              target="_blank"
              title="GMAIL"
            >
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  alt="_Email_img"
                  src={gmail}
                />
                <p className="share-link-icon-text">Email</p>
              </div>
            </Link>
          </div>
          <div className="share-link-item ">
            <Link>
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  src={textSms}
                  alt="_Message_img"
                />
                <p className="share-link-icon-text">Message</p>
              </div>
            </Link>
          </div>
          <div className="share-link-item ">
            <Link
              to={`whatsapp://send?text=${window.location.href}`}
              target="_blank"
            >
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  src={whatsapp}
                  alt="_whatsapp_img"
                />
                <p>WhatsApp</p>
              </div>
            </Link>
          </div>
          <div className="share-link-item ">
            <Link>
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  alt="_messenger_img"
                  src={messenger}
                />
                <p className="share-link-icon-text">Messenger</p>
              </div>
            </Link>
          </div>
          <div className="share-link-item ">
            <Link>
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  src={facebook}
                  alt="_facebook"
                />
                <p className="share-link-icon-text">FaceBook</p>
              </div>
            </Link>
          </div>

          <div className="share-link-item ">
            <Link
              to={`https://twitter.com/intent/tweet?text=${window.location.href}`}
              target="_blank"
            >
              <div className="share-link-icon">
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  loading="lazy"
                  src={twitter}
                  alt="_twitter"
                />
                <p className="share-link-icon-text">Twitter</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProduct;
