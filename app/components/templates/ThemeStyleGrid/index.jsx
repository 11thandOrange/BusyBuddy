import React, { useState } from "react";
import "./style.css"; // Import the CSS file
import { Text } from "@shopify/polaris";
import { ThemeStyleGridType } from "../../../constants/announcementBarConfig";

function ThemeStyleGrid({ onThemeSelected = () => {} }) {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const gridData = [
    {
      id: 1,
      name: "Child 1",
      image: "https://placehold.co/200",
      type: ThemeStyleGridType.COLOR,
    },
    {
      id: 2,
      name: "Child 2",
      image:
        "https://plus.unsplash.com/premium_photo-1687203673190-d39c3719123a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVsbG98ZW58MHx8MHx8fDA%3D",
      type: ThemeStyleGridType.IMAGE,
    },
    {
      id: 3,
      name: "Child 3",
      image:
        "data:image/png;base64,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",
      type: ThemeStyleGridType.IMAGE,
    },
    {
      id: 4,
      name: "Child 1",
      image: "https://placehold.co/200",
      type: ThemeStyleGridType.COLOR,
    },
  ];

  const handleItemClick = (index, type, image) => {
    setSelectedIndex(index === selectedIndex ? null : index); // Toggle selection
    onThemeSelected(index, type, image);
  };

  return (
    <div>
      <div className="theme-style-header">
        <Text variant="bodyMd" fontWeight="bold" as="span">
          Theme Style
        </Text>
      </div>
      <div className="grid-container">
        {gridData.map((item, index) => (
          <div
            key={item.id}
            className={`grid-item ${selectedIndex === item.id ? "selected" : ""}`}
            onClick={() => handleItemClick(item.id, item.type, item.image)}
          >
            <p>{item.name}</p>
            <img src={item.image} alt={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThemeStyleGrid;
