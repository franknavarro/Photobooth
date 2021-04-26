const { ipcMain } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

ipcMain.handle('start-print', async (_, printer, printFile) => {
  const { stderr } = await exec(`lp -d ${printer} ${printFile}`);
  if (stderr) throw new Error(stderr);
  return;
});

ipcMain.handle('print-status', async () => {
  const { stdout, stderr } = await exec('lpstat');
  if (stderr) throw new Error(stderr);
  else if (stdout) return true;
  return false;
});

ipcMain.handle('printer-list', async () => {
  const { stdout, stderr } = await exec('lpstat -p');
  if (stderr) throw new Error(stderr);
  const printers = stdout.split('\n').filter((p) => p);
  if (!printers.length) return [];
  return printers.map((p) => p.split(/\s+/)[1]);
});
