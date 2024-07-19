import React, { useEffect, useRef, useState } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import BackgroundVideo from "../../../assets/Image/BackgroundVideo.mp4";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import { fetchAboutUs } from "../../../redux/slices/aboutUsSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import BackgroundImageLeft from "../../../assets/Image/BackgroundImageLeft.png";
import { useCallback } from "react";
import { toastError } from "../../../utils/reactToastify";

const CancelationPolicy = () => {
  const { loading, aboutUs } = useSelector((state) => state.aboutUs);
  const dispatch = useDispatch();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/CancelationPolicy`
      );
      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  useEffect(() => {
    dispatch(fetchAboutUs());
  }, [dispatch]);

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      >
       
      </div>{" "}
      <br></br>
      <div class="page">
        <div class="translations-content-container">
          <div class="container">
            <div
              class="tab-content translations-content-item en visible"
              id="en"
            >
              <h1>Return and Refund Policy</h1>
              <p>Last updated: May 16, 2024</p>
              <p>Thank you for shopping at Railingo.</p>
              <p>
                If, for any reason, You are not completely satisfied with a
                purchase We invite You to review our policy on refunds and
                returns. This Return and Refund Policy has been created with the
                help of the{" "}
                <a
                  href="https://www.termsfeed.com/return-refund-policy-generator/"
                  target="_blank"
                >
                  Return and Refund Policy Generator
                </a>
                .
              </p>
              <p>
                The following terms are applicable for any products that You
                purchased with Us.
              </p>
              <h2>Interpretation and Definitions</h2>
              <h3>Interpretation</h3>
              <p>
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>
              <h3>Definitions</h3>
              <p>For the purposes of this Return and Refund Policy:</p>
              <ul>
                <li>
                  <p>
                    <strong>Company</strong> (referred to as either &quot;the
                    Company&quot;, &quot;We&quot;, &quot;Us&quot; or
                    &quot;Our&quot; in this Agreement) refers to Railingo,
                    Hennur, Kuvempu Layout, Kothanpur, Bengaluru, Karnataka,
                    560077, India.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Goods</strong> refer to the items offered for sale
                    on the Service.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Orders</strong> mean a request by You to purchase
                    Goods from Us.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Service</strong> refers to the Website.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Website</strong> refers to Railingo, accessible from{" "}
                    <a
                      href="https://railingo.com/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      https://railingo.com/
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>You</strong> means the individual accessing or using
                    the Service, or the company, or other legal entity on behalf
                    of which such individual is accessing or using the Service,
                    as applicable.
                  </p>
                </li>
              </ul>
              <h2>Your Order Cancellation Rights</h2>
              <p>
                You are entitled to cancel Your Order within 7 days without
                giving any reason for doing so.
              </p>
              <p>
                The deadline for cancelling an Order is 7 days from the date on
                which You received the Goods or on which a third party you have
                appointed, who is not the carrier, takes possession of the
                product delivered.
              </p>
              <p>
                In order to exercise Your right of cancellation, You must inform
                Us of your decision by means of a clear statement. You can
                inform us of your decision by:
              </p>
              <ul>
                <li>
                  <p>
                    By email:{" "}
                    <a
                      href="/cdn-cgi/l/email-protection"
                      class="__cf_email__"
                      data-cfemail="acc5c2cac3ecdecdc5c0c5c2cbc382cfc3c1"
                    >
                      [email&#160;protected]
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    By visiting this page on our website:{" "}
                    <a
                      href="https://railingo.com/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      https://railingo.com/
                    </a>
                  </p>
                </li>
                <li>
                  <p>By phone number: +91 8755999395</p>
                </li>
              </ul>
              <p>
                We will reimburse You no later than 14 days from the day on
                which We receive the returned Goods. We will use the same means
                of payment as You used for the Order, and You will not incur any
                fees for such reimbursement.
              </p>
              <h2>Conditions for Returns</h2>
              <p>
                In order for the Goods to be eligible for a return, please make
                sure that:
              </p>
              <ul>
                <li>The Goods were purchased in the last 7 days</li>
                <li>The Goods are in the original packaging</li>
              </ul>
              <p>The following Goods cannot be returned:</p>
              <ul>
                <li>
                  The supply of Goods made to Your specifications or clearly
                  personalized.
                </li>
                <li>
                  The supply of Goods which according to their nature are not
                  suitable to be returned, deteriorate rapidly or where the date
                  of expiry is over.
                </li>
                <li>
                  The supply of Goods which are not suitable for return due to
                  health protection or hygiene reasons and were unsealed after
                  delivery.
                </li>
                <li>
                  The supply of Goods which are, after delivery, according to
                  their nature, inseparably mixed with other items.
                </li>
              </ul>
              <p>
                We reserve the right to refuse returns of any merchandise that
                does not meet the above return conditions in our sole
                discretion.
              </p>
              <p>
                Only regular priced Goods may be refunded. Unfortunately, Goods
                on sale cannot be refunded. This exclusion may not apply to You
                if it is not permitted by applicable law.
              </p>
              <h2>Returning Goods</h2>
              <p>
                You are responsible for the cost and risk of returning the Goods
                to Us. You should send the Goods at the following address:
              </p>
              <p>
                Hennur, Kuvempu Layout, Kothanpur, Bengaluru, Karnataka, 560077,
                India
              </p>
              <p>
                We cannot be held responsible for Goods damaged or lost in
                return shipment. Therefore, We recommend an insured and
                trackable mail service. We are unable to issue a refund without
                actual receipt of the Goods or proof of received return
                delivery.
              </p>
              <h2>Gifts</h2>
              <p>
                If the Goods were marked as a gift when purchased and then
                shipped directly to you, You'll receive a gift credit for the
                value of your return. Once the returned product is received, a
                gift certificate will be mailed to You.
              </p>
              <p>
                If the Goods weren't marked as a gift when purchased, or the
                gift giver had the Order shipped to themselves to give it to You
                later, We will send the refund to the gift giver.
              </p>
              <h3>Contact Us</h3>
              <p>
                If you have any questions about our Returns and Refunds Policy,
                please contact us:
              </p>
              <ul>
                <li>
                  <p>
                    By email: <a href="#">info@railingo.com</a>
                  </p>
                </li>
                <li>
                  <p>
                    By visiting this page on our website:{" "}
                    <a
                      href="https://railingo.com/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      https://railingo.com/
                    </a>
                  </p>
                </li>
                <li>
                  <p>By phone number: +91 8755999395</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <MainFooter />
    </>
  );
};

export default CancelationPolicy;