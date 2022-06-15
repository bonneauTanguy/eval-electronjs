const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')
const path = require('path')

const menu = [
    {
        label : 'File',
        submenu : [
            {
                label: 'New task',
                click() {
                    if (win) {
                        win.show()
                    } else {
                        createNewWindow()
                    }
                }
            },
            {
                label: 'Quit',
                accelerator: 'CommandOrControl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

const createWidow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'script/preload-list.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    })
    win.loadFile('template/index.html')
    return win
}

let w
app.whenReady().then(()=> {
    w = createWidow()
    win = createNewWindow()
    win.hide()
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    const mainMenu  = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
})

const createNewWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'script/preload-addTask.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    })
    win.loadFile('template/addTask.html')
    return win
}

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

ipcMain.on('task:read', (e, data) => {
    task.getTask(data).then(
        data => {
            w.webContents.send('async:task:read', data)
        }
    )
})
ipcMain.on('list:read', (e, data) => {
    lists.getList().then(
        data => {
            w.webContents.send('async:list:read', data)
        }
    )
})
