import React, { useEffect, useState } from "react";
import extIcon from "@assets/ext_icon.png";
import "@pages/popup/Popup.scss";
import useStorage from "@src/shared/hooks/useStorage";
import { extensionStorage } from "@root/src/shared/storages/extensionStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import withErrorBoundary from "@src/shared/hoc/withErrorBoundary";
import { Switch } from "./components/Switch";

const Popup = () => {
  const { extensionEnabled, userWork } = useStorage(extensionStorage);
  const [isExtensionON, toggleExtension] = useState<boolean>(extensionEnabled);
  const [textProject, setTextProject] = useState<string>(userWork.projectId);
  const [textLink, setTextLink] = useState<string>(userWork.link);

  const onToggleExtension = () => {
    toggleExtension(!isExtensionON);
    extensionStorage.toggleExtension(!isExtensionON);
  };

  const onClickSave = () => {
    extensionStorage.setUserWork({projectId: textProject, link: textLink });
    // chrome.storage.sync.set({ dataUserWork: {projectId: textProject, link: textLink }});
  }

  // useEffect(() => { 
  //   chrome.storage.sync.get(['dataUserWork'], (result) => {
  //     if(Object.keys(result).length) {
  //       setTextProject(result.dataUserWork.projectId);
  //       setTextLink(result.dataUserWork.textLink);
  //     }
  //   });
  // },[])

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
      {isExtensionON && <section className="SectionData">
        <div>
          <p>Project Id</p>
          <input type="text" 
          onChange={(e)=> setTextProject(e.target.value)} 
          value={textProject} /> 
        </div>

        <div>
          <p>Full name</p>
          <input type="text"  
          onChange={(e)=> setTextLink(e.target.value)} 
          value={textLink} />
        </div>
        <button 
          onClick={onClickSave}
          className="SaveButton">
          Save
        </button>
      </section>}
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
