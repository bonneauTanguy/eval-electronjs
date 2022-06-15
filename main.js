const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')
const path = require('path')
const database = require('./model/Database')
const Task = require('./model/Task')
const List = require('./model/List')
const db = new database('task.db')
const task = new Task(db)
const lists = new List(db)

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
    Task.getTask(data).then(
        data => {
            w.webContents.send('async:task:read', data)
        }
    )
})
ipcMain.on('list:read', (e, data) => {
    lists.getLists().then(
        data => {
            w.webContents.send('async:list:read', data)
        }
    )
})
ipcMain.on('task:add', (e , data) => {
    // dialog.showMessageBox({
    //   type: 'info',
    //   title: 'Item ajouté',
    //   message: 'Bravo vous avez ajouté un item'
    // })
    const notif = new Notification({
        title: 'Item ajouté',
        body: 'Bravo vous avez ajouté un item',
        icon: 'assets/check_one_icon.png'
    })
    Task.addTask(data)
        .then(
            () => {
                w.webContents.send('item:add', data)
                w.reload()
            },
            error => console.log(error)
        )

    // BrowserWindow.fromWebContents(e.sender).close();
    notif.show()
})

ipcMain.on('item:delete', (e, data) => {
    Task.deteleTask(data.id).then(
        () => {
            w.reload()
        },
        error => console.log(error)
    )
})

ipcMain.on('task:update', (e, data) => {
    win.show()
    win.webContents.send('async:update', data)
})

ipcMain.on('task:update:persist', (e, data) => {
    Task.updateTask(data).then(
        () => {
            w.reload()
            win.hide()
        },
        error => console.log(error)
    )
})

if (process.env.NODE_ENV !== 'production') {
    menu.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform ==='darwin' ? 'Command+I' : 'Ctrl+I',

                click(item, focusedWindow) {
                    focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                role: 'reload',
                accelerator:'F5'
            }
        ]
    })
}
