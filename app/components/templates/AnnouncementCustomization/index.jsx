import React, { useCallback, useEffect, useRef, useState } from "react";
import Selector from "../../atoms/Selector";
import "./Settings.css";
import { Card, Page, Text } from "@shopify/polaris";
import CustomTextField from "../../atoms/CustomTextField";

import ThemeStyleGrid from "../ThemeStyleGrid";
import ProductPreviewCard from "../ProductPreviewCard";

import ThemeSettings from "../ThemeSettings";
import GeneralSettings from "../../atoms/GeneralSettings/announcementBars/Text";
import {
  ANNOUNCEMENT_BAR_INITIAL_STATE,
  ANNOUNCEMENT_BAR_TYPES,
  ANNOUNCEMENT_BARS_ERROR_STATE,
  ANNOUNCEMENT_BARS_TABS,
  COLOR_THEME,
  SETTINGS_INITIAL_STATE,
  STATUS,
} from "../../../constants/announcementCustomizationConfig";
import FreeShippingSettings from "../../atoms/generalSettings/announcementBars/FreeShipping";
import OrderCounterSettings from "../../atoms/generalSettings/announcementBars/OrderCounter";
import CountdownTimerSettings from "../../atoms/generalSettings/announcementBars/CountdownTimer";
import EmailCaptureSettings from "../../atoms/generalSettings/announcementBars/EmailCapture";
import {
  hasChanges,
  updateState,
  isLoading,
  checkError,
} from "../../../utils/clientFunctions";
import { APP_TYPE, ROUTES } from "../../../utils/constants";
import UnsavedChangesBar from "../../atoms/UnsavedChangesBar";
import DiscardChangesConfirmationPopup from "../../atoms/DiscardChangesConfirmationPopup";
import { useSettingsChanged } from "../../../hooks/useSettingsChanged";
import ManageDataChange from "../ManageDataChange";
import { useFetcher } from "@remix-run/react";
import Toast from "../../atoms/Toast";
import { useNavigate } from "@remix-run/react";

const options = [
  { label: "Active", value: STATUS.ACTIVE },
  { label: "Inactive", value: STATUS.INACTIVE },
];

const AnnouncementCustomization = ({
  announcementBarType,
  header = "Customization",
  backActionRoute = ROUTES.APPS,
  initialData,
  colorTheme = COLOR_THEME.LIGHT,
}) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const generalSettings = ANNOUNCEMENT_BAR_INITIAL_STATE[announcementBarType];
  const [settingsState, setSettingsState] = useState({
    ...SETTINGS_INITIAL_STATE,
    ...generalSettings,
  });
  const prevSettingsState = useRef({});
  const [error, setError] = useState({ ...ANNOUNCEMENT_BARS_ERROR_STATE });
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
            error={error}
            setError={setError}
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
  }, [settingsState, ANNOUNCEMENT_BAR_TYPES, error]);

  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    if (initialData) {
      setSettingsState(initialData);
      setShowLoader(false);
      prevSettingsState.current = initialData;
    }
  }, [initialData]);

  const handleOnSave = () => {
    if (initialData) {
      fetcher.submit(
        {
          id: initialData.id,
          name: settingsState.name,
          status: Number(settingsState.status),
          general_setting: JSON.stringify(settingsState.generalSettings),
          theme_style: JSON.stringify(settingsState.themeStyle),
          theme_settings: JSON.stringify(settingsState.themeSettings),
          type: announcementBarType,
          _action: "UPDATE",
        },
        {
          method: "POST",
          action: ROUTES.ANNOUNCEMENT_OVERVIEW,
        },
      );
    } else {
      fetcher.submit(
        {
          name: settingsState.name,
          status: Number(settingsState.status),
          general_setting: JSON.stringify(settingsState.generalSettings),
          theme_style: JSON.stringify(settingsState.themeStyle),
          theme_settings: JSON.stringify(settingsState.themeSettings),
          type: announcementBarType,
          _action: "CREATE",
        },
        {
          method: "POST",
          action: ROUTES.ANNOUNCEMENT_OVERVIEW,
        },
      );
      prevSettingsState.current = settingsState;
    }
  };
  useEffect(() => {
    if (!isLoading(fetcher.state) && fetcher.data) {
      goback();
    }
  }, [fetcher]);

  const goback = () => {
    navigate('/apps/announcementBar?appId=1', {
      state: { tabToOpen: ANNOUNCEMENT_BARS_TABS.ANNOUNCEMENT_BAR },
    });
  };
  return (
    <div>
      <Page
      // backAction={{ content: "Settings", url: backActionRoute }}
      // title={header}
      // primaryAction={<ActiveButton></ActiveButton>}
      >
        <Toast
          show={!isLoading(fetcher.state) && fetcher.data}
          message="Settings saved"
        />
        <div className="customization-container">
          <ManageDataChange
            newState={settingsState}
            prevState={prevSettingsState.current}
            handleSaveChanges={() => {
              handleOnSave();
            }}
            handleDiscardChanges={() => {
              if (Object.keys(prevSettingsState.current).length > 0) {
                setSettingsState(prevSettingsState.current);
              }
              goback();
            }}
            fetcherState={fetcher.state}
            isError={checkError(error)}
            showBarInitially={true}
          />
          <div className="customization-left-section">
            <Card>
              <Selector
                options={options}
                label="Status"
                helpText="Only one announcement bar will be displayed at the time"
                onSelect={(value) => {
                  setSettingsState((prevState) =>
                    updateState("status", value, prevState),
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
                    updateState("name", value, prevState),
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
                    updateState(
                      "themeStyle",
                      { id: value, type: type, image: image },
                      prevState,
                    ),
                  );
                }}
                selectedTheme={settingsState.themeStyle.id}
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
              colorTheme={colorTheme}
            ></ProductPreviewCard>
          </div>
        </div>
      </Page>
    </div>
  );
};

export default AnnouncementCustomization;
