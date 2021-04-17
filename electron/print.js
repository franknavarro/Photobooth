const { ipcMain } = require('electron');
const { exec } = require('child_process');

const PRINTER = 'DNP';

ipcMain.handle('start-print', async (_, printFile) => {
  return await new Promise((result, reject) => {
    exec(`lp -d ${PRINTER} ${printFile}`, (error, stdout, stderr) => {
      if (error) return reject(error);
      else if (stderr) return reject(stderr);
      return result(true);
    });
  });
});

ipcMain.handle('print-status', async () => {
  return await new Promise((result, reject) => {
    exec('lpstat', (error, stdout, stderr) => {
      if (error) return reject(error);
      else if (stderr) return reject(stderr);
      if (stdout) return result(true);
      else return result(false);
    });
  });
});
