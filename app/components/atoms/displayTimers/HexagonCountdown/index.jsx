import React from "react";
import "./style.css";

const HexagonCountdown = ({ timeUnits, settingsState }) => {
  const { display } = settingsState;
  const { digitsColor } = display;

  return (
    <div className="HexagonCountdown" style={{ color: digitsColor }}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="HexagonCountdown-item">
          <span className="HexagonCountdown-number">{unit.value}</span>
          <span className="hexaValue">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default HexagonCountdown;
