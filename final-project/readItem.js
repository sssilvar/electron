const {BrowserWindow} = require('electron')

let bgItemwin

module.exports = (url, callback) => {
    bgItemwin = new BrowserWindow({
        width: 1000,
        height: 1000,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    // Load url
    bgItemwin.loadURL(url)

    // Wait for content to load
    bgItemwin.webContents.on('did-finish-load', () => {
        // Get screenshot
        bgItemwin.webContents.capturePage((image) => {
            let screenshot = image.toDataURL()
            let title = bgItemwin.getTitle()

            // return via callback
            callback({ title, screenshot, url })

            // clean up
            bgItemwin.close()
            bgItemwin = null
        })
    })
}