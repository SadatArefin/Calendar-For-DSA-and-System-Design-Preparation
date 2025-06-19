# DSA & System Design Goal Calendar

A beautiful cross-platform desktop calendar app for tracking your DSA (Data Structures & Algorithms) and System Design preparation goals. Built with Electron, this app helps you plan, visualize, and get reminders for your daily and weekly study targets.

---

## Features

- **Interactive Calendar UI**: View your goals in a monthly calendar grid with color-coded DSA and System Design days.
- **Goal Details Modal**: Click any day to view, edit, or add custom goals and notes.
- **Reminders & Notifications**: Set daily reminders for each goal. Get native desktop notifications at your chosen time.
- **Custom Goal Support**: Add your own custom reminders and notes for any date.
- **Persistent Storage**: All goals and reminders are saved locally in `goals.json`.
- **Cross-Platform**: Runs on Windows, macOS, and Linux.
- **Modern, Responsive UI**: Clean, desktop-friendly design with smooth navigation.
- **Offline-First**: No internet required after installation.

---

## Planned & Possible Future Additions

- **Sync with Google Calendar or Outlook**
- **Export/Import Goals** (CSV, JSON)
- **Theme Customization** (Dark mode, color themes)
- **Progress Tracking & Analytics**
- **Recurring Reminders** (e.g., every Monday)
- **Mobile Companion App**
- **Cloud Backup & Multi-device Sync**
- **Goal Templates & Suggestions**
- **Motivational Quotes/Widgets**

---

## Installation & Usage

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Git](https://git-scm.com/) (for cloning)

### 1. Clone the Repository
```sh
git clone https://github.com/sadatArefin/Calendar-For-DSA-and-System-Design-Preparation.git
cd Calendar-For-DSA-and-System-Design-Preparation
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the App (Development Mode)
```sh
npm start
```

The app will launch in a desktop window.

---

## Building for Production

This app uses [electron-builder](https://www.electron.build/) for packaging and cross-platform builds.

### Windows
```sh
npm run package
```
- Output: `dist/` folder with `.exe` and portable builds.

### macOS
```sh
npm run package
```
- Output: `dist/` folder with `.zip` (or `.dmg`) builds.

### Linux
```sh
npm run package
```
- Output: `dist/` folder with `.AppImage` builds.

> **Note:** On non-Windows platforms, you may need to run with `sudo` or adjust permissions for AppImage/zip files.

#### Automated CI/CD
- See `.github/workflows/release.yml` for GitHub Actions workflow that builds and publishes releases for Windows, macOS, and Linux on new version tags.

---

## File Structure

- `main.js` — Electron main process, handles window, reminders, and IPC.
- `renderer.js` — Frontend logic for calendar UI and modals.
- `preload.js` — Secure bridge between renderer and main process.
- `goals.json` — Local storage for all goals and reminders.
- `index.html` — Main UI layout.
- `style.css` — Modern, responsive styles.
- `assets/` — App icons.

---

## Contributing

Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

## Author

Sadat Arefin Rafat

---

## Acknowledgements
- [Electron](https://www.electronjs.org/)
- [node-schedule](https://www.npmjs.com/package/node-schedule)
- [electron-builder](https://www.electron.build/)

---

## Contact
For questions or feedback, open an issue or contact via GitHub.
