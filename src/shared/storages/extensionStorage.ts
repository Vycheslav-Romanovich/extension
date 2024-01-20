import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

type Storage = {
  theme: "light" | "dark";
  extensionEnabled: boolean;
  userInfo: any;
  isParsing: boolean;
};

type StorageData = BaseStorage<Storage> & {
  toggleTheme: () => void;
  toggleExtension: (isEnabled) => void;
  setUserInfo: (isEnabled) => void;
  setIsParsing: (isEnabled) => void;
};

const storage = createStorage<Storage>(
  "Storage-speach-ext",
  { theme: "light", extensionEnabled: true, userInfo: {}, isParsing:false },
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
        isParsing:data
      };
    });
  },

  setUserInfo: (data) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: data,
        isParsing:false
      };
    });
  },
  toggleTheme: () => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
        isParsing:false
      };
    });
  },
  toggleExtension: (isEnabled) => {
    storage.set((storage) => {
      return {
        theme: storage.theme,
        extensionEnabled: isEnabled,
        userInfo: storage.userInfo,
        isParsing:false
      };
    });
  },
};
