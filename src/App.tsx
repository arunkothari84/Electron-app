import { useEffect, useState } from "react";

import ShortcutCard from "./ShortcutCard";

function App() {
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState({ title: "Loading...", shortcuts: [] });

  useEffect(() => {
    const load = async () => {
      const data = await window.configAPI.getConfig();
      setConfig(data);
      console.log("Loaded config:", data);
    };

    load();

    // Listen for file changes
    window.configAPI.onConfigChange(() => {
      console.log("Detected external config change.");
      load();
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
    <div className="bg-gray-900 min-h-screen p-6 text-white font-sans select-none w-screen">
      <h1 className="text-2xl font-bold mb-4 text-indigo-400">
        {config.title}
      </h1>

      <input
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Search shortcuts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid gap-3">
        {filtered.map((shortcut, index) => (
          <ShortcutCard key={index} {...shortcut} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400">No shortcuts found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
