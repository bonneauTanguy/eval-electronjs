const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    "task", {
        receive: (channel, func) => {
            ipcRenderer.on(channel, (e, ...args) => func(...args))
        },
        send: (channel, data) => {
            ipcRenderer.send(channel, data)
        }
    }
)