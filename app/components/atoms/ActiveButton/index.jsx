import { Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import "./activeButton.css";
import { useSearchParams } from "react-router-dom";
import { useFetcher } from "@remix-run/react";
import useToast from "../../../hooks/useToast";
import ToastBar from "../Toast";
export default function ActiveButton({
  beforeActiveString = "Active",
  afterActivateString = "Activate App",
  deactivateString = "Deactivate App",
  isAppActive = false,
  handleAppActive = () => {},
  temp = true, //Temporary
}) {
  const fetcher = useFetcher();
  const [popoverActive, setPopoverActive] = useState(false);
  const [isActive, setIsActive] = useState(isAppActive);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("appId");
  const { showToast, onDismiss } = useToast(fetcher);
  const handleActive = (isActive) => {
    console.log(isActive)
    if (temp) {
      fetcher.submit(
        {
          isActive:isActive==true?'true':'false',
          appId: id,
        },
        {
          method: "POST",
          action: "/app/activate",
        },
      );
      console.log(fetcher)
    }
  };
  useEffect(() => {
    setIsActive(isAppActive);
  }, [isAppActive]);
  useEffect(()=>{
    console.log(fetcher.data)
  }, [fetcher])
  const togglePopoverActive = useCallback(() => {
    setPopoverActive((popoverActive) => !popoverActive);
  }, []);
  const toggleIsActive = useCallback(() => {
    handleActive(!isActive);
    setIsActive((isActive) => !isActive);
  }, []);
  const onActiveClick = () => {
    if (!isActive) {
      toggleIsActive();
    } else {
      togglePopoverActive();
    }
  };

  const activator = (
    <Button onClick={onActiveClick} className="active" disclosure={isActive}>
      {isActive ? beforeActiveString : afterActivateString}
    </Button>
  );

  return (
    <div className="bb-sec-btn">
      <ToastBar
        onDismiss={onDismiss}
        show={showToast}
        message={isActive ? "App Activated" : "App Deactivated"}
      />
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <div className="bb-deactive-app-btn">
          <ActionList
            actionRole="menuitem"
            items={[{ content: deactivateString }]}
            onActionAnyItem={() => {
              //When we click on deactivate, we set isActive to false and close the popover

              toggleIsActive();
              togglePopoverActive();
            }}
          />
        </div>
      </Popover>
    </div>
  );
}
