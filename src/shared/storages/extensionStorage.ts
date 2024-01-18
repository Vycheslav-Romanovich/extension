import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Storage = {
  theme: "light" | "dark";
  extensionEnabled: boolean;
};

type StorageData = BaseStorage<Storage> & {
  toggleTheme: () => void;
  toggleExtension: (isEnabled) => void;
};

const storage = createStorage<Storage>(
  "Storage-speach-ext",
  { theme: "light", extensionEnabled: true },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

export const extensionStorage: StorageData = {
  ...storage,

  toggleTheme: () => {
    storage.set((storage) => {
      return {
        theme: storage.theme === "light" ? "dark" : "light",
        extensionEnabled: storage.extensionEnabled,
      };
    });
  },
  toggleExtension: (isEnabled) => {
    storage.set((storage) => {
      return {
        theme: storage.theme,
        extensionEnabled: isEnabled,
      };
    });
  },
};

