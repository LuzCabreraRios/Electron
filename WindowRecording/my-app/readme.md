# Electron Project: WindowRecording

This project is a vanilla Electron application initialized via Electron Forge, designed for core Electron API implementation without additional bundlers.

---

## 🚀 Project Initialization

To replicate this environment from scratch:

1. **Generate the App**:
   `npx create-electron-app@latest my-app`
   *Selection: No template, no vite, no webpack.*

2. **Setup and Installation**:
   `cd my-app`
   `npm install`

3. **Run the Application**:
   `npm start`

---

## ⚙️ Essential Configuration (.gitignore)

**CRITICAL:** To prevent Git from entering an infinite loop while indexing massive dependency folders, ensure your .gitignore contains:

node_modules/
out/
.webpack/
.electron-forge/
npm-debug.log*
.DS_Store
Thumbs.db

---

## 📂 Project Structure

* src/index.js: The Main Process that manages the application lifecycle.
* src/index.html: The Renderer Process (UI layer).
* src/preload.js: The secure bridge for inter-process communication (IPC).
* forge.config.js: Configuration for packaging and distribution.


---

## 📜 Credits & Modifications

All credits for the core logic go to **Fireship**: [Original Source](https://github.com/fireship-io/223-electron-screen-recorder/tree/master). [Youtube Video](https://www.youtube.com/watch?v=3yqDxhR2XxE)

The code has been modified and updated to support newer versions of Electron.

---
Maintained by Luz Eduardo Cabrera Rios, Computer Science student at Wayne State College.