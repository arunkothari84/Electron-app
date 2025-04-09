# 🔗 Shortcut Helper

A sleek desktop app built with **Electron**, **Vite**, and **React**, designed to enhance productivity by instantly popping up on a global shortcut. The window disappears when clicking outside, ensuring a seamless and non-intrusive experience.

---

## ✨ Features

- ⚡ Built with Electron + Vite + React
- 🪟 Frameless, centered window on your current screen
- ⌨️ Global shortcut support (`Ctrl + Shift + H`)
- 🧽 Closes when clicked outside
- 🔄 Can be triggered multiple times to reopen
- 🎯 Responsive for HiDPI / multiple screen setups

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Setup

```bash
git clone https://github.com/your-username/shortcut-helper.git
cd shortcut-helper
npm install
```

---

## 👨‍💻 Development

To start the Vite dev server and Electron:

```bash
npm run dev
```

Or run Electron directly:

```bash
npm run electron
```

---

## 📦 Build

To package your app using `electron-builder`:

```bash
npm run build
```

The output will be available in the `dist/` folder.

---

## 🧠 Project Structure

```
.
├── electron/             # Main Electron process
│   └── main.ts           # Main window logic
├── src/                  # Renderer process (React)
│   ├── preload/          # Preload scripts
│   └── main.tsx          # React entry
├── public/               # Static assets (favicon, etc.)
├── uses/username/.shortcut-helper/
│   ├── icon.png
│   └── shortcut-helper-config.json
├── icon.png              # App icon
├── package.json
└── ...
```

---

## 🧩 How to Use

1. **Prepare Required Files**

   Create the following folder and files:

   ```
   ~/uses/your-username/.shortcut-helper/
   ├── icon.png
   └── shortcut-helper-config.json
   ```

   - `icon.png`: Custom icon to be used in the tray.
   - `shortcut-helper-config.json`: Your personal configuration for the helper window.
   - Example:
 ```{
  "title": "⚡ Shortcuts!",
  "shortcuts": [
    {
      "keys": "Ctrl+C",
      "action": "Copy"
    },
    {
      "keys": "Ctrl+V",
      "action": "Paste"
    }
  ]
}
```
     
2. **Use Shortcut**

   Press `Ctrl + Shift + H` to open the helper window.  
   Click **outside** the window to close it.

3. **Repeat**

   You can use the shortcut multiple times to launch new instances.

---

## 📄 License

MIT © [Your Name]
```

---

Let me know if you want this saved and sent as a file too!
