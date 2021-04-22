const fs = require('fs');
const os = require('os');
const path = require('path');

let tempDir;

const appendTmp = (file) => {
  if (!tempDir) {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'photobooth-'));
  }
  return path.join(tempDir, file);
};

exports.appendTmp = appendTmp;
