import { Icon } from "@shopify/polaris";
import React from "react";
import { BulletIcon } from "@shopify/polaris-icons";
import "./style.css";

const TickIcon = () => {
  return <Icon source={BulletIcon} tone="success" />;
};

const Details = ({ description, points }) => {
  return (
    <div className="homepage-details">
      <h2 className="description">{description}</h2>
      <div className="points-grid">
        {points.map((point, index) => (
          <div
            key={index}
            className={`point ${index % 2 === 0 ? "left" : "right"}`}
          >
            <TickIcon />
            <div>
              <span className="point-description">{point}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
