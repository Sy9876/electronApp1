electron test
====

# hello word

- package.json
- main.js
- index.html

package.json:

```json
{
    "name": "myapp",
    "version": "1.0.01",
    "main": "main.js"
}

```

main.js

```js
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
    mainWindow = new BrowserWindow();
    mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
    mainWindow.on('closed', () => { mainWindow = null; });
});

```

index.html

```html
<html>
    <head>myapp</head>
    <body>
        <h1>hello word</h1>
    </body>
</html>
```

启动app

```
npm install -g electron
electron .
```
