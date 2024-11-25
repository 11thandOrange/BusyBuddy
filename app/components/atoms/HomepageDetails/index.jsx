import React from "react";
import "./homepageDetails.css"; // Assuming you will style using this file
import PopoverContent from "../../templates/PopoverContent";
import {
  ANNOUNCEMENT_BAR_TYPES,
  announcementPopoverData,
} from "../../../constants/announcementCustomizationConfig";

import { Icon } from "@shopify/polaris";
import Details from "../Details";
const HomepageDetails = ({ selectedType, setSelectedType }) => {
  const description =
    "Capture leads, communicate free shipping thresholds or make store-wide announcements with the help of header bars.";
  const points = [
    "Show how much users have left to spend for Free Shipping",
    "Create urgency with the Countdown Timer Bar",
    "Capture emails by giving a discount with the Email Capture Bar",
    "Choose from 10+ themes and easily customize the design",
  ];

  return (
    <>
      <Details description={description} points={points}></Details>
      <div>
        <PopoverContent
          options={announcementPopoverData}
          heading="Create Announcement Bar"
          onSelect={(selectedType) => {
            setSelectedType(selectedType);
          }}
        ></PopoverContent>
      </div>
    </>
  );
};

export default HomepageDetails;
