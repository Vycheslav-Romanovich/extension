import React, { useEffect, useState } from "react";
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
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const onToggleExtension = () => {
    toggleExtension(!isExtensionON);
    extensionStorage.toggleExtension(!isExtensionON);
  };

  const onClickSave = () => {
    setIsLoader(true);
    extensionStorage.setUserWork({projectId: textProject, link: textLink });
    setTimeout(() => {
      setIsLoader(false);
    }, 500);
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
            <span className="Title"><span>5S</span>Control</span>
          </div>
        </div>
        <Switch isChecked={isExtensionON} toggleSwitch={onToggleExtension} />
      </header>
      {isExtensionON && <>
        <section className="SectionData">
        <div>
          <p>Project</p>
          <input type="text" 
          placeholder="Project name"
          onChange={(e)=> setTextProject(e.target.value)} 
          value={textProject} /> 
        </div>

        <div>
          <p>Your name</p>
          <input type="text"  
          placeholder="Full name"
          onChange={(e)=> setTextLink(e.target.value)} 
          value={textLink} />
        </div>
        </section>
        <p className="TextVisible">This info will be visible to your supervisor.</p>
        <button 
          onClick={onClickSave}
          className="SaveButton">
            {isLoader && <span className="Loader"></span>}
          Save
        </button>
        </>
      }
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>
);
