"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const os = require("os");
const promises = require("fs/promises");
const fs = require("fs");
const clientGlue = require("@aws-sdk/client-glue");
const credentialProviders = require("@aws-sdk/credential-providers");
const CONFIG_DIR = path.join(os.homedir(), ".gins-proton");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const DEFAULT_CONFIG = {
  region: "us-east-1",
  profile: "default"
};
async function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    const data = await promises.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read config:", err);
    return DEFAULT_CONFIG;
  }
}
async function saveConfig(config) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      await promises.mkdir(CONFIG_DIR, { recursive: true });
    }
    await promises.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save config:", err);
  }
}
let client = null;
let currentConfig = null;
function getClient(config) {
  if (!client || currentConfig?.region !== config.region || currentConfig?.profile !== config.profile) {
    try {
      client = new clientGlue.GlueClient({
        region: config.region,
        credentials: credentialProviders.fromIni({ profile: config.profile })
      });
      currentConfig = { ...config };
    } catch (e) {
      console.error("Failed to init AWS Client", e);
      throw e;
    }
  }
  return client;
}
const awsHandler = {
  async getJobs(config) {
    const c = getClient(config);
    const command = new clientGlue.GetJobsCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.Jobs || [];
  },
  async getJobRuns(config, jobName) {
    const c = getClient(config);
    const command = new clientGlue.GetJobRunsCommand({ JobName: jobName, MaxResults: 20 });
    const response = await c.send(command);
    return response.JobRuns || [];
  },
  async getCrawlers(config) {
    const c = getClient(config);
    const command = new clientGlue.GetCrawlersCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.Crawlers || [];
  },
  async getCrawlerRuns(_config, _crawlerName) {
    return [];
  },
  async getDatabases(config) {
    const c = getClient(config);
    const command = new clientGlue.GetDatabasesCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.DatabaseList || [];
  },
  async getTables(config, databaseName) {
    const c = getClient(config);
    const command = new clientGlue.GetTablesCommand({ DatabaseName: databaseName, MaxResults: 50 });
    const response = await c.send(command);
    return response.TableList || [];
  },
  async getWorkflows(config) {
    const c = getClient(config);
    const listCmd = new clientGlue.ListWorkflowsCommand({ MaxResults: 25 });
    const listRes = await c.send(listCmd);
    if (!listRes.Workflows || listRes.Workflows.length === 0) return [];
    const detailsCmd = new clientGlue.BatchGetWorkflowsCommand({ Names: listRes.Workflows, IncludeGraph: false });
    const detailsRes = await c.send(detailsCmd);
    return detailsRes.Workflows || [];
  },
  async getWorkflowRuns(config, workflowName) {
    const c = getClient(config);
    const command = new clientGlue.GetWorkflowRunsCommand({ Name: workflowName, MaxResults: 20 });
    const response = await c.send(command);
    return response.Runs || [];
  }
};
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon: path.join(__dirname, "../../build/icon.png") } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.ipcMain.handle("config:read", async () => readConfig());
electron.ipcMain.handle("config:save", async (_, config) => saveConfig(config));
electron.ipcMain.handle("aws:list-jobs", async (_, config) => awsHandler.getJobs(config));
electron.ipcMain.handle("aws:get-job-runs", async (_, config, jobName) => awsHandler.getJobRuns(config, jobName));
electron.ipcMain.handle("aws:list-crawlers", async (_, config) => awsHandler.getCrawlers(config));
electron.ipcMain.handle("aws:get-crawler-runs", async (_, config, crawlerName) => awsHandler.getCrawlerRuns(config, crawlerName));
electron.ipcMain.handle("aws:list-databases", async (_, config) => awsHandler.getDatabases(config));
electron.ipcMain.handle("aws:get-tables", async (_, config, dbName) => awsHandler.getTables(config, dbName));
electron.ipcMain.handle("aws:list-workflows", async (_, config) => awsHandler.getWorkflows(config));
electron.ipcMain.handle("aws:get-workflow-runs", async (_, config, wfName) => awsHandler.getWorkflowRuns(config, wfName));
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
