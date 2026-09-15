const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const PORT = Number(process.env.ONEX_PORT || 3210);
let serverProcess;

function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) return resolve();
        retry();
      });
      request.on("error", retry);
      request.setTimeout(1500, () => { request.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) return reject(new Error(`Onex server did not start at ${url}`));
      setTimeout(check, 250);
    };
    check();
  });
}

function startOnexServer() {
  const projectRoot = app.isPackaged ? process.resourcesPath : path.resolve(__dirname, "..");
  const serverEntry = path.join(projectRoot, "dist", "index.js");
  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
    stdio: "pipe",
    windowsHide: true,
  });
  serverProcess.stdout.on("data", (data) => console.log(`[Onex] ${data}`));
  serverProcess.stderr.on("data", (data) => console.error(`[Onex] ${data}`));
  serverProcess.on("error", (error) => console.error("Onex server error", error));
}

async function createWindow() {
  startOnexServer();
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
  } catch (error) {
    await dialog.showMessageBox({ type: "error", title: "Onex ERP", message: "تعذر تشغيل خادم Onex المحلي.", detail: String(error) });
    app.quit();
    return;
  }

  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: "#0b1425",
    autoHideMenuBar: true,
    title: "Onex ERP Workbench",
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  await window.loadURL(`http://127.0.0.1:${PORT}/`);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (serverProcess) serverProcess.kill(); if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (serverProcess) serverProcess.kill(); });
