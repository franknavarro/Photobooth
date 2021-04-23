const Store = require('electron-store');

const store = new Store({
  schema: {
    photostrip: {
      type: 'object',
      default: {},
      properties: {
        maxPhotos: {
          type: 'number',
          default: 3,
          minimum: 1,
          maximum: 4,
        },
      },
    },
    interface: {
      type: 'object',
      default: {},
      properties: {
        initialCount: {
          type: 'number',
          default: 6,
          minimum: 1,
        },
        countTime: {
          type: 'number',
          default: 4,
          minimum: 1,
        },
        waitTime: {
          type: 'number',
          default: 3,
          minimum: 1,
        },
      },
    },
  },
});

exports.store = store;
