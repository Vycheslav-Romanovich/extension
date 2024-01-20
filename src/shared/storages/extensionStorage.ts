import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

type Storage = {
  theme: "light" | "dark";
  extensionEnabled: boolean;
  userInfo: any;
};

type StorageData = BaseStorage<Storage> & {
  toggleTheme: () => void;
  toggleExtension: (isEnabled) => void;
  setUserInfo: (isEnabled) => void;
};

const storage = createStorage<Storage>(
  "Storage-speach-ext",
  { theme: "light", extensionEnabled: true, userInfo: {} },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  }
);

export const extensionStorage: StorageData = {
  ...storage,

  setUserInfo: (data) => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: data,
      };
    });
  },
  toggleTheme: () => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
        userInfo: storage.userInfo,
      };
    });
  },
  toggleExtension: (isEnabled) => {
    storage.set((storage) => {
      return {
        theme: storage.theme,
        extensionEnabled: isEnabled,
        userInfo: storage.userInfo,
      };
    });
  },
};
