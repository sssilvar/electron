const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Browser window instance
exports.win

// Create mainWindow funcion
exports.createWindow = () => {
    this.win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 310
    })

    // DevTools
    this.win.webContents.openDevTools()

    // Load window content
    this.win.loadURL(url.format({
        pathname: path.join(__dirname, 'renderer', 'main.html'),
        protocol: 'file',
        slashes: true
    }))

    // Listen for closing events
    this.win.on('closed', () => {
        this.win = null
    })
}