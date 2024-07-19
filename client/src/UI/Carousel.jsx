import React, { useEffect, useCallback } from "react";

const Carousel = ({ children }) => {
  const showPreviousImage = () => {
    const prevButton = document.querySelector(".carousel-control-prev");
    if (prevButton) {
      prevButton.click();
    }
  };

  const showNextImage = () => {
    const nextButton = document.querySelector(".carousel-control-next");
    if (nextButton) {
      nextButton.click();
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 37) {
      // Left arrow key
      showPreviousImage();
    } else if (e.keyCode === 39) {
      // Right arrow key
      showNextImage();
    }
  }, []);

  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);
    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      id="carouselExampleDark"
      className="carousel carousel-dark slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">{children}</div>
      <button
        className="carousel-control-prev"
        type="button"
        style={{ background: "0 0", height: "auto" }}
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
        onClick={showPreviousImage}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        style={{ background: "0 0", height: "auto" }}
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
        onClick={showNextImage}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
