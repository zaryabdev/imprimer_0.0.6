const { contextBridge, ipcRenderer } = require('electron');
const WINDOW_API = {
  ipcRenderer: {
    createBill(preloadData) {
      console.log("Inside preload create:bill")
      console.log({preloadData})
      ipcRenderer.send('create:bill', preloadData);
    },
    updateBill(preloadData) {
      console.log("Inside preload update:bill")
      console.log({preloadData})

      ipcRenderer.send('update:bill', preloadData);
    },

    deleteBill(preloadData) {
      console.log("Inside preload delete:bill")
      console.log({preloadData})

      ipcRenderer.send('delete:bill', preloadData);
    },
    getAllBills(preloadData) {
      console.log("Inside preload get:bills")
      console.log({preloadData})

      ipcRenderer.send('get:bills', preloadData);
    },
    on(channel, func) {
      const validChannels = ['get:bills','delete:bill','update:bill','create:bill'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
}

contextBridge.exposeInMainWorld('electron',WINDOW_API );
