import { contextBridge, ipcRenderer } from "electron";
import fs from "fs";
import os from "os";
import path from "path";

interface Shortcut {
  keys: string;
  action: string;
}

interface Config {
  title: string;
  shortcuts: Shortcut[];
}

// Default config structure
const defaultConfig: Config = {
  title: "Shortcut Helper",
  shortcuts: [],
};

const configPath = path.join(
  os.homedir(),
  ".shortcut-helper",
  "shortcut-helper-config.json"
);

async function ensureConfig() {
  if (!fs.existsSync(configPath)) {
    await fs.promises.mkdir(path.dirname(configPath), { recursive: true });
    await fs.promises.writeFile(
      configPath,
      JSON.stringify(defaultConfig, null, 2),
      "utf-8"
    );
  }
}

(async () => {
  await ensureConfig();
})();

contextBridge.exposeInMainWorld("configAPI", {
  getConfig: async () => {
    try {
      const data = await fs.promises.readFile(configPath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading config:", err);
      return defaultConfig;
    }
  },
  onConfigChange: (callback: () => void) => {
    fs.watch(configPath, (eventType) => {
      if (eventType === "change") {
        callback();
      }
    });
  },
});
