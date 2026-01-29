// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSources: () => ipcRenderer.invoke('get-sources'),
  showSourceMenu: (sources) => ipcRenderer.invoke('show-source-menu', sources),
  saveVideo: (arrayBuffer) =>
  ipcRenderer.invoke('save-video', arrayBuffer),

});
console.log('preload loaded');
