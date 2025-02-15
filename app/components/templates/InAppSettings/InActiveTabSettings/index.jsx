import React, { useEffect, useRef, useState } from "react";

import { Checkbox, Layout } from "@shopify/polaris";

import { useFetcher } from "@remix-run/react";
import ManageDataChange from "../../ManageDataChange";
import { ROUTES } from "../../../../utils/constants";
import SettingSection from "../../GlobalSettings/SettingSection";
import CustomTextField from "../../../atoms/CustomTextField";
import ToastBar from "../../../atoms/Toast";
import useToast from "../../../../hooks/useToast";

const InActiveTabSettings = ({ initialData }) => {
  const fetcher = useFetcher();
  const [settings, setSettings] = useState({
    message: "",
    // enableBotFilter: false,
  });
  const oldSettingRef = useRef({
    message: "",
  });

  const { showToast, onDismiss } = useToast(fetcher);
  useEffect(() => {
    if (initialData) {
      const data = { message: initialData.message };
      setSettings(data);
      oldSettingRef.current = data;
    }
  }, [initialData]);

  const handleSaveSettingsData = () => {
    fetcher.submit(
      {
        message: settings.message,
      },
      { method: "POST", action: ROUTES.INACTIVE_TAB },
    );
  };

  const handleDiscardChanges = () => {
    setSettings(oldSettingRef.current);
  };
  const updateCustomization = (field, value) => {
    setSettings((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div>
      <Layout>
        <ToastBar
          onDismiss={onDismiss}
          show={showToast}
          message="Settings saved successfully"
        />
        <ManageDataChange
          newState={settings}
          prevState={oldSettingRef.current}
          handleSaveChanges={handleSaveSettingsData}
          handleDiscardChanges={handleDiscardChanges}
          fetcherState={fetcher.state}
        />
        <SettingSection heading={"Inactive Tab Message"}>
          <CustomTextField
            helpText={
              "The message that will show in the browser tab's title when the visitor changes to another tab."
            }
            label={"Message"}
            type={"text"}
            value={settings.message}
            onValueChange={(value) => updateCustomization("message", value)}
          ></CustomTextField>
        </SettingSection>
      </Layout>
    </div>
  );
};

export default InActiveTabSettings;
