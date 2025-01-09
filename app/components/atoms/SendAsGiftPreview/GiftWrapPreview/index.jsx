import { Checkbox } from "@shopify/polaris";
import React from "react";

const GiftWrapPreview = ({ settingsState, imgURL }) => {
  return (
    <div className="content-container">
      <div className="title-price-container">
        <Checkbox
          label={
            <div className="gift-title">{settingsState.giftWrapTitle}</div>
          }
        ></Checkbox>

        <div className="gift-price">${settingsState.giftWrapPrice}</div>
      </div>
      <img
        className="gift-image"
        src={imgURL || ""}
        alt={settingsState.giftWrapTitle || "Gift Wrap"}
      />
    </div>
  );
};

export default GiftWrapPreview;
