import React, { useState } from "react";
import extIcon from "@assets/ext_icon.png";
import "@pages/popup/Popup.scss";
import useStorage from "@src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import { Switch } from "./components/Switch";

const Popup = () => {
  const { extensionEnabled } = useStorage(extensionStorage);
  const [isExtensionON, toggleExtension] = useState<boolean>(extensionEnabled);

  const onToggleExtension = () => {
    toggleExtension(!isExtensionON);
    extensionStorage.toggleExtension(!isExtensionON);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="LogoContainer">
          <div className="LogoTitle">
            <span className="Title">5sControl</span>
            <span className="Subtitle"> Is enable LinkdIn extension</span>
          </div>
        </div>
        <Switch isChecked={isExtensionON} toggleSwitch={onToggleExtension} />
      </header>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
