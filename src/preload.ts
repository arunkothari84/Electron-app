import { contextBridge, ipcRenderer } from "electron";
import fs from "fs";
import os from "os";
import path from "path";

// For reading .ini format
import ini from "ini"; // You need to install this: npm install ini

interface Shortcut {
  keys: string;
  action: string;
}

interface MouseConfig {
  Profile: number;
  Color: string;
  Keys: {
    [key: string]: string; // Keys are dynamic (e.g., "1", "2", ..., "12")
  };
}

interface Config {
  title: string;
  shortcuts: Shortcut[];
  powertoys: Shortcut[];
  stickies: Shortcut[];
  mouse: MouseConfig[];
}

// Default config structure
const defaultConfig: Config = {
  title: "Shortcut Helper",
  shortcuts: [],
  powertoys: [],
  stickies: [],
  mouse: [],
};

const configPath = path.join(os.homedir(), ".shortcut-helper", "config.json");

// Path to the Redragon config file
const redragonConfigPath = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "REDRAGON Gaming Mouse",
  "IMPACT",
  "Config.ini"
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

// Reads the ProfileID from the Redragon config file
async function readProfileID(): Promise<number | null> {
  try {
    const data = await fs.promises.readFile(redragonConfigPath, "utf-8");
    const parsed = ini.parse(data);
    return parsed.Config?.ProfileID
      ? parseInt(parsed.Config.ProfileID, 10)
      : null;
  } catch (err) {
    console.error("Error reading Redragon config:", err);
    return null;
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
  // Expose ProfileID getter
  getProfileID: async () => {
    return await readProfileID();
  },
  // Watch the Redragon INI file for changes
  onProfileIDChange: (callback: (newProfileID: number | null) => void) => {
    let lastProfileID: number | null = null;

    const checkChange = async () => {
      const newID = await readProfileID();
      if (newID !== lastProfileID) {
        lastProfileID = newID;
        callback(newID);
      }
    };

    // Initial read
    checkChange();

    fs.watch(redragonConfigPath, (eventType) => {
      if (eventType === "rename") {
        console.log("Detected change in Redragon config file.");
        checkChange();
      }
    });
  },
});
