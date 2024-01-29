import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import "webextension-polyfill";
import { getTranslateFromAPI } from "./utils/getTranslateFromAPI";
reloadOnUpdate("pages/background");

reloadOnUpdate("pages/content/style.scss");

export const getTranslate = async (request, sender, sendResponse) => {
  const data = await getTranslateFromAPI(request.text, "en", "ru");
  sendResponse(data);
};

chrome.tabs.onCreated.addListener((tab) => {
  console.log("New taab " + tab.url);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "translate") {
    getTranslate(request, sender, sendResponse);
  }
  return true;
});

// if (chrome.runtime.setUninstallURL) {
//   chrome.storage.sync.clear()
//   chrome.storage.local.clear()
// }


// let creating; // A global promise to avoid concurrency issues
// async function setupOffscreenDocument(path) {
//   // Check all windows controlled by the service worker to see if one
//   // of them is the offscreen document with the given path
//   const offscreenUrl = chrome.runtime.getURL(path);
//    //@ts-ignore
//   const existingContexts = await chrome.runtime.getContexts({
//     contextTypes: ['OFFSCREEN_DOCUMENT'],
//     documentUrls: [offscreenUrl]
//   });

//   if (existingContexts.length > 0) {
//     return;
//   }

//   // create offscreen document
  
//   if (creating) {
//     await creating;
//   } else {
//     creating = chrome.offscreen.createDocument({
//       url: path,
//        //@ts-ignore
//       reasons: ['LOCAL_STORAGE'],
//       justification: 'reason for needing the document',
//     });
//     await creating;
//     creating = null;
//   }
// }