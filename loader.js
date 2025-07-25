const fs = require('fs');

const nocache = (module, cb = () => {}) => {
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module));
    cb(module);
  });
};

const uncache = (module = '.') => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { nocache, uncache };
