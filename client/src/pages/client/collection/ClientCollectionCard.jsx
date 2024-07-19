import React, { useState } from "react";
import "./ClientCollectionCard.css";
import { Link } from "react-router-dom";
import CatalogueCollection from "./CatalogueCollection";

const ClientCollectionCard = ({ p, index }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div className="col-lg-4 exclusivedesignstyle">
      <Link to={`/collection/${p.url}`} className="sub-channel-info" style={{backgroundColor:"#F7F8FC"}}>
        <div
          className="col-lg-12 img-box"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {isHover ? (
            p && p?.video && p?.video?.length > 0 ? (
              <iframe
                width="600px"
                height="360px"
                src={p?.video}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <CatalogueCollection productImages={p?.CollectionImage} />
            )
          ) : (
            <CatalogueCollection productImages={p?.CollectionImage} />
          )}
        </div>{" "}
        <p
          className="sub-channel-title"
          style={{
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          {p.title}
        </p>
      </Link>
      {/* <p className="sub-channel-title">
        {p?.description
          ?.replace(/<\/?(p|br|span)(\/)?>/g, (match) =>
            match === "<br>" ? " " : ""
          )
          .replace(/<\/?p>/g, "")
          .replace(/<span[^>]*>/g, "")
          .replace(/<\/span>/g, "")}
      </p> */}
    </div>
  );
};

export default ClientCollectionCard;
