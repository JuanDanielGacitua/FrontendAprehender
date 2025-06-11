import React from "react";
import "../../styles/Courses.css";

const MaterialCategoryCard = ({ title, image, onClick }) => {
  return (
    <div className="material-card">
      <img src={image} alt={title} className="material-card-img" />
      <button className="material-card-btn" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default MaterialCategoryCard;
