import React from "react";
import "../../styles/Courses.css";

const MaterialCategoryCard = ({ title, image, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={image} alt={title} className="category-image" />
      <button className="category-button">{title}</button>
    </div>
  );
};

export default MaterialCategoryCard;
