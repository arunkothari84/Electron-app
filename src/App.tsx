import { useEffect, useState } from "react";
import ShortcutCard from "./ShortcutCard";

function App() {
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState({
    title: "Loading...",
    shortcuts: [],
    powertoys: [],
    stickies: [],
    mouse: [],
  });
  const [profileID, setProfileID] = useState<number | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await window.configAPI.getConfig();
      setConfig(data);
      console.log("Loaded config:", data);
    };

    const loadProfileID = async () => {
      const id = await window.configAPI.getProfileID();
      setProfileID(id);
      console.log("Loaded ProfileID:", id);
    };

    loadConfig();
    loadProfileID();

    // Watch config changes
    window.configAPI.onConfigChange(() => {
      console.log("Detected external config change.");
      loadConfig();
    });

    // Watch profile ID changes
    window.configAPI.onProfileIDChange((newID: number | null) => {
      console.log("Detected ProfileID change:", newID);
      setProfileID(newID);
    });
  }, []);

  const addShortcut = async () => {
    const updated = {
      ...config,
      shortcuts: [
        ...config.shortcuts,
        { keys: "Ctrl+Shift+N", action: "New Window" },
      ],
    };
    setConfig(updated);
    await window.configAPI.setConfig(updated); // persist to disk
  };

  const filtered = config.shortcuts.filter(
    (item) =>
      item.keys.toLowerCase().includes(query.toLowerCase()) ||
      item.action.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid grid-flow-col grid-rows-3 gap-4 font-sans h-screen">
      {/* For global shortcuts (scrollable) */}
      <div className=" p-6 pt-0 text-white select-none row-span-3 overflow-y-auto max-h-screen sticky top-0">
        <div className="sticky top-0 pt-6 bg-gray-900 z-10">
          <h1 className="text-2xl font-bold mb-4 text-indigo-400">
            {config.title}
          </h1>

          <input
            className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search shortcuts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-3 z-0">
          {filtered.map((shortcut, index) => (
            <ShortcutCard key={index} {...shortcut} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400">No shortcuts found.</p>
          )}
        </div>
      </div>

      {/* For PowerToys shortcuts (static) */}
      <div className="bg-gray-900 overflow-y-auto max-h-screen row-start-1 col-start-2 p-6 pt-0 sticky top-0">
        <h1 className="text-2xl font-bold mb-4 text-indigo-400 sticky top-0 pt-6 pb-3 bg-gray-900 z-10">
          💪PowerToys
        </h1>
        <div className="grid gap-3">
          {config.powertoys.map((shortcut, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              <div className="text-yellow-300 font-mono text-sm">
                {shortcut.keys}
                <span className="pl-2 text-white">{shortcut.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Stickies shortcuts (static) */}
      <div className="bg-gray-900 overflow-y-auto max-h-screen row-start-1 col-start-3 p-6 pt-0 sticky top-0">
        <h1 className="text-2xl font-bold mb-4 text-indigo-400 sticky top-0 pt-6 pb-3 bg-gray-900 z-10">
          📝Stickies
        </h1>
        <div className="grid gap-3">
          {config.stickies.map((shortcut, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-700 transition duration-200 ease-in-out"
            >
              <div className="text-yellow-300 font-mono text-sm">
                {shortcut.keys}
                <span className="pl-2 text-white">{shortcut.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Red-dragon shortcuts (static) */}
      <div className="bg-gray-900 col-span-2 row-start-2 row-span-2 p-6 sticky top-0">
        <h1 className="text-2xl font-bold mb-4 text-indigo-400">🐁Mouse</h1>
        <div className="grid grid-cols-3 gap-4 p-4">
          {Array.from({ length: 12 }, (_, i) => {
            const mouseItem = config.mouse.find(
              (item) => item.Profile === profileID
            );

            return (
              <div
                key={i}
                className="flex items-center gap-4 p-3 border rounded-lg bg-gray-800 shadow text-white"
                style={{ borderColor: mouseItem ? mouseItem.Color : "#ffffff" }}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 text-lg font-bold">
                  {i + 1}
                </div>
                <span className="text-base font-medium">
                  {mouseItem ? mouseItem.Keys[i + 1] : "No data"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
