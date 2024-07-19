import React, { useState } from "react";
import "./style.css";

const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text" onClick={toggleReadMore}>
      {isReadMore ? text?.slice(0, 600) : text}
      <span
        onClick={toggleReadMore}
        className="read-or-hide"
        style={{ color: "green" }}
      >
        {isReadMore ? "...read more" : "show less"}
      </span>
    </p>
  );
};

export default ReadMore;
