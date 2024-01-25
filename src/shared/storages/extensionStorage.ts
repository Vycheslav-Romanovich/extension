import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

import { IUserWork, IUserInfo } from "@root/src/constants/types";

type Storage = {
  theme: "light" | "dark";
  extensionEnabled: boolean;
  userInfo: IUserInfo;
  isParsing: boolean;
  userWork: IUserWork;
};

type StorageData = BaseStorage<Storage> & {
  toggleTheme: () => void;
  toggleExtension: (isEnabled) => void;
  setUserInfo: (isEnabled) => void;
  setUserWork: (isEnabled) => void;
  setIsParsing: (isEnabled) => void;
};

const storage = createStorage<Storage>(
  "Storage-speach-ext",
  { theme: "light", extensionEnabled: true, 
    userInfo: 
    {about: '',
    aboutAuthor: '',
    company: '',
    experience: '',
    link: '',
    name: '',
    position: ''}, 
    isParsing:false, 
    userWork: { projectId: '', link: ''} },
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
        isParsing:data,
        userWork: storage.userWork
      };
    });
  },

  setUserInfo: (data) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: data,
        isParsing:false,
        userWork: storage.userWork
      };
    });
  },

  toggleTheme: () => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing:false,
        userWork: storage.userWork
      };
    });
  },

  toggleExtension: (isEnabled) => {
    storage.set((storage) => {
      return {
        theme: storage.theme,
        extensionEnabled: isEnabled,
        userInfo: storage.userInfo,
        isParsing:false,
        userWork: storage.userWork
      };
    });
  },

  setUserWork: (data: IUserWork) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing:false,
        userWork: data
      };
    });
  },
};
