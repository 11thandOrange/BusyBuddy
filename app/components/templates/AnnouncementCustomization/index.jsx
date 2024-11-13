import React, { useCallback, useEffect, useState } from "react";
import Selector from "../../atoms/Selector";
import "./Settings.css";
import { Card, Text } from "@shopify/polaris";
import CustomTextField from "../../atoms/CustomTextField";

import ThemeStyleGrid from "../ThemeStyleGrid";
import ProductPreviewCard from "../ProductPreviewCard";

import ThemeSettings from "../ThemeSettings";
import GeneralSettings from "../../atoms/GeneralSettings/announcementBars/Text";
import {
  ANNOUNCEMENT_BAR_INITIAL_STATE,
  ANNOUNCEMENT_BAR_TYPES,
  SETTINGS_INITIAL_STATE,
  STATUS,
} from "../../../constants/announcementCustomizationConfig";
import FreeShippingSettings from "../../atoms/generalSettings/announcementBars/FreeShipping";
import OrderCounterSettings from "../../atoms/generalSettings/announcementBars/OrderCounter";
import CountdownTimerSettings from "../../atoms/generalSettings/announcementBars/CountdownTimer";
import EmailCaptureSettings from "../../atoms/generalSettings/announcementBars/EmailCapture";
import { updateSettingsState } from "../../../utils/clientFunctions";
import { APP_TYPE } from "../../../utils/constants";
import UnsavedChangesBar from "../../atoms/UnsavedChangesBar";
import DiscardChangesConfirmationPopup from "../../atoms/DiscardChangesConfirmationPopup";

const options = [
  { label: "Active", value: STATUS.ACTIVE },
  { label: "Inactive", value: STATUS.INACTIVE },
];

const AnnouncementCustomization = ({ announcementBarType }) => {
  const generalSettings = ANNOUNCEMENT_BAR_INITIAL_STATE[announcementBarType];
  const [settingsState, setSettingsState] = useState({
    ...SETTINGS_INITIAL_STATE,
    ...generalSettings,
  });

  const selectGeneralSettings = useCallback(() => {
    switch (announcementBarType) {
      case ANNOUNCEMENT_BAR_TYPES.TEXT:
        return (
          <GeneralSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></GeneralSettings>
        );
      case ANNOUNCEMENT_BAR_TYPES.FREE_SHIPPING:
        return (
          <FreeShippingSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></FreeShippingSettings>
        );
      case ANNOUNCEMENT_BAR_TYPES.ORDERS_COUNTER:
        return (
          <OrderCounterSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></OrderCounterSettings>
        );
      case ANNOUNCEMENT_BAR_TYPES.COUNTDOWN_TIMER:
        return (
          <CountdownTimerSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></CountdownTimerSettings>
        );
      case ANNOUNCEMENT_BAR_TYPES.EMAIL_CAPTURE:
        return (
          <EmailCaptureSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></EmailCaptureSettings>
        );

      default:
        break;
    }
  }, [settingsState]);

  return (
    <div className="customization-container">
      <UnsavedChangesBar
        saveActionButtonClick={() => {
          console.log("Updated state", settingsState);
        }}
        discardActionButtonClick={() => {
          <DiscardChangesConfirmationPopup></DiscardChangesConfirmationPopup>;
        }}
      ></UnsavedChangesBar>
      <div className="customization-left-section">
        {/* <Card>
            <SettingsDisplay></SettingsDisplay>
            </Card> */}
        <Card>
          <Selector
            options={options}
            label="Status"
            helpText="Only one announcement bar will be displayed at the time"
            onSelect={(value) => {
              setSettingsState((prevState) =>
                updateSettingsState("status", value, prevState),
              );
            }}
            initialValue={settingsState.status}
          ></Selector>
        </Card>
        <Card>
          <CustomTextField
            type="text"
            label="Name"
            helpText="The private name of this smart bar. Only you will see this."
            onValueChange={(value) => {
              setSettingsState((prevState) =>
                updateSettingsState("name", value, prevState),
              );
            }}
            value={settingsState.name}
          ></CustomTextField>
        </Card>
        <Card>
          <div className="general-settings-header">
            <Text variant="bodyMd" fontWeight="bold" as="span">
              General Settings
            </Text>
          </div>
          {selectGeneralSettings()}
        </Card>
        <Card>
          <ThemeStyleGrid
            onThemeSelected={(value, type, image) => {
              setSettingsState((prevState) =>
                updateSettingsState(
                  "themeStyle",
                  { id: value, type: type, image: image },
                  prevState,
                ),
              );
            }}
          ></ThemeStyleGrid>
        </Card>
        <Card>
          <ThemeSettings
            setSettingsState={setSettingsState}
            settingsState={settingsState}
          ></ThemeSettings>
        </Card>
      </div>
      <div className="customization-right-section">
        <ProductPreviewCard
          setSettingsState={setSettingsState}
          settingsState={settingsState}
          announcementBarType={announcementBarType}
          appType={APP_TYPE.ANNOUNCEMENT_BARS}
        ></ProductPreviewCard>
      </div>
    </div>
  );
};

export default AnnouncementCustomization;
