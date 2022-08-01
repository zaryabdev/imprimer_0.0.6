const { contextBridge, ipcRenderer } = require('electron');
const WINDOW_API = {
  ipcRenderer: {
    createBill(preloadData) {
      console.log("Inside preload create:bill")
      console.log({preloadData})

      ipcRenderer.send('create:bill', preloadData);
    },
    on(channel, func) {
      const validChannels = ['create:bill'];
      console.log(`Inside Channel on create:bill`);

      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['create:bill'];
      console.log(`Inside Channel once create:bill`);
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    updateBill(preloadData) {
      console.log("Inside preload update:bill")
      console.log({preloadData})

      ipcRenderer.send('update:bill', preloadData);
    },
    on(channel, func) {
      const validChannels = ['update:bill'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['update:bill'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    deleteBill(preloadData) {
      console.log("Inside preload delete:bill")
      console.log({preloadData})

      ipcRenderer.send('delete:bill', preloadData);
    },
    on(channel, func) {
      const validChannels = ['delete:bill'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['delete:bill'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    getAllBills(preloadData) {
      console.log("Inside preload get:bills")
      console.log({preloadData})

      ipcRenderer.send('get:bills', preloadData);
    },
    on(channel, func) {
      const validChannels = ['get:bills'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['get:bills'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
}

contextBridge.exposeInMainWorld('electron',WINDOW_API );
