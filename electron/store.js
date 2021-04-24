const Store = require('electron-store');

const store = new Store({
  schema: {
    photostrip: {
      type: 'object',
      default: {},
      properties: {
        borders: {
          type: 'object',
          default: {},
          properties: {
            horizontal: {
              type: 'number',
              default: 0,
              minimum: 0,
            },
            vertical: {
              type: 'number',
              default: 0,
              minimum: 0,
            },
          },
        },
        maxPhotos: {
          type: 'number',
          default: 3,
          minimum: 1,
          maximum: 4,
        },
        stripImage: {
          type: 'string',
          default: '',
        },
        stripSize: {
          type: 'object',
          default: {},
          properties: {
            height: {
              const: 6,
              default: 6,
            },
            width: {
              type: 'number',
              default: 2,
              enum: [2, 4],
            },
          },
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
    printer: {
      type: 'object',
      default: {},
      properties: {
        printerName: {
          type: 'string',
          default: '',
        },
      },
    },
  },
});

exports.store = store;
