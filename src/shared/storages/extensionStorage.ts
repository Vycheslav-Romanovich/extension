import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

import { IUserWork, IUserInfo } from "@root/src/constants/types";
import { textPromtReset } from "@root/src/constants/textsPromt";

type Storage = {
  theme: "light" | "dark";
  extensionEnabled: boolean;
  userInfo: IUserInfo;
  isParsing: boolean;
  userWork: IUserWork;
  textPromt: string;
  postLink: string;
};

type StorageData = BaseStorage<Storage> & {
  toggleTheme: () => void;
  toggleExtension: (isEnabled) => void;
  setUserInfo: (isEnabled) => void;
  setUserWork: (isEnabled) => void;
  setIsParsing: (isEnabled) => void;
  setTextPromt: (isEnabled) => void;
  setPostLink: (isEnabled) => void;
};

const storage = createStorage<Storage>(
  "Storage-linkidin-ext",
  {
    theme: "light",
    extensionEnabled: true,
    userInfo: {
      about: '-',
      aboutAuthor: '-',
      company: '-',
      experience: '-',
      link: '-',
      name: '-',
      position: '-'
    },
    isParsing: false,
    userWork: { projectId: '-', link: '-' },
    textPromt: textPromtReset,
    postLink: '-',
  },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  }
);

export const extensionStorage: StorageData = {
  ...storage,

  setIsParsing: (data) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing: data,
        userWork: storage.userWork,
        textPromt: storage.textPromt,
        postLink: storage.postLink
      };
    });
  },

  setUserInfo: (data) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: data,
        isParsing: false,
        userWork: storage.userWork,
        textPromt: storage.textPromt,
        postLink: storage.postLink
      };
    });
  },

  toggleTheme: () => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing: false,
        userWork: storage.userWork,
        textPromt: storage.textPromt,
        postLink: storage.postLink
      };
    });
  },

  toggleExtension: (isEnabled) => {
    storage.set((storage) => {
      return {
        theme: storage.theme,
        extensionEnabled: isEnabled,
        userInfo: storage.userInfo,
        isParsing: false,
        userWork: storage.userWork,
        textPromt: storage.textPromt,
        postLink: storage.postLink
      };
    });
  },

  setUserWork: (data: IUserWork) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing: false,
        userWork: data,
        textPromt: storage.textPromt,
        postLink: storage.postLink
      };
    });
  },

  setTextPromt: (data: string) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing: false,
        userWork: storage.userWork,
        textPromt: data,
        postLink: storage.postLink
      };
    });
  },

  setPostLink: (data: string) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing: false,
        userWork: storage.userWork,
        textPromt: storage.textPromt,
        postLink: data
      };
    });
  },
};
