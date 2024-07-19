import React, { useState } from "react";
import MobileMenuSidebar from "../MobileMenuSidebar/MobileMenuSidebar";

const MobileMenuIcon = () => {
  
  const [manageMobileMenu, setmanageMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setmanageMobileMenu(!manageMobileMenu);
  };

  return (
    <>
      {manageMobileMenu && (
        <MobileMenuSidebar toggleMobileMenu={toggleMobileMenu} />
      )}

      <li
        className="Hoverclass"
        onClick={() => setmanageMobileMenu(!manageMobileMenu)}
      >
        {/* <i className="fa fa-cart-shopping" style={{ paddingLeft: 10 }} /> */}
        <span
          id="btnmenuhide"
          style={{
            fontSize: 30,
            cursor: "pointer",
            color: "#fff",
            float: "right",
          }}
        >
          ☰
        </span>

        {/* <img src="~/Images/locateud.png" width="32" height="32" style="padding: 5px 0 0 5px; margin-top: -5px; margin-left: 0;"> */}
        {/* <p><a id="D3" href="" target="_blank" style="color: #fff; text-decoration: none;">GET ON ROAD PRICE</a></p> */}
      </li>
    </>
  );
};

export default MobileMenuIcon;
