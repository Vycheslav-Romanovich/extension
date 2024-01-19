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
