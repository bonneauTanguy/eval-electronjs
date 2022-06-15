const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            ipcRenderer.send(channel, data)
        },
        getTask: (channel, func) => {
            ipcRenderer.on(channel, (e, ...args) => func(...args))
        }
    }
)