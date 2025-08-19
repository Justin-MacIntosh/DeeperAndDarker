import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const electronApi = {
  fullscreen: () => {
    ipcRenderer.invoke('fullscreen');
  },
  windowed: () => {
    ipcRenderer.invoke('windowed');
  },
  devtools: () => {
    ipcRenderer.invoke('devtools');
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
contextBridge.exposeInMainWorld('electronApi', electronApi);
