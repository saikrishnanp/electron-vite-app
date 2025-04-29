import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import path from 'path'

// Custom APIs for renderer
const api = {
  readFile: (filePath: string) => {
    return fs.readFileSync(filePath, "utf-8");
  },
  writeFile: (filePath: string, content: string) => {
    fs.writeFileSync(filePath, content, "utf-8");
  },
  deleteFile: (filePath: string) => {
    fs.unlinkSync(filePath);
  },
  getFileName: (filePath: string) => {
    return path.basename(filePath);
  },
  listDirectory: (directoryPath: string) => {
    return fs.readdirSync(directoryPath);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
