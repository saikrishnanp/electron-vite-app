import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      readFile: (filePath: string) => string;
      writeFile: (filePath: string, content: string) => void;
      deleteFile: (filePath: string) => void;
      getFileName: (filePath: string) => string;
      listDirectory: (directoryPath: string) => string[];
    };
  }
}

export {};
