const { ipcMain } = require('electron');
const { exec } = require('child_process');

ipcMain.handle('start-print', async (_, printer, printFile) => {
  return await new Promise((result, reject) => {
    exec(`lp -d ${printer} ${printFile}`, (error, _, stderr) => {
      if (error) return reject(error);
      else if (stderr) return reject(stderr);
      return result();
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
