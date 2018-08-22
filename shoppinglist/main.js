const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = require('electron')

// Set ENV
process.env.NODE_ENV = 'production';

let mainWindow;


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})
  
    // and load the HTML of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    
    // If mac, add empty object to menu
    if(process.platform == 'darwin') mainMenuTemplate.unshift({});

    // Build menu and set it into the app
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      app.quit()
    });
  }

// Create Add Item window
function createAddWindow() {
    addWindow = new BrowserWindow({width: 300, height: 200, title: 'Add Item'})
  
    // and load the HTML of the app.
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

// Listen for app to be ready
app.on('ready', createWindow);

// Catch item:add
ipcMain.on('item:add', (e, item) => {
    console.log(item)
    mainWindow.webContents.send('item:add', item);        
    addWindow.close();
});


// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: 'CmdOrCtrl+Shift+A',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Add DevTools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}