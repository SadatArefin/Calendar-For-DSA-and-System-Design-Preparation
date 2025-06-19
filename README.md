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
- **Google Calendar Sync**: Sync your goals with your primary Google Calendar.

---

## Planned & Possible Future Additions

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

### Setting Up Google Calendar Sync (Optional)

To enable syncing with Google Calendar, you need to set up Google API credentials.

1.  **Create a Google Cloud Project**:
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.

2.  **Enable the Google Calendar API**:
    *   In your new project, go to "APIs & Services" > "Enabled APIs & services".
    *   Click "+ ENABLE APIS AND SERVICES" and search for "Google Calendar API".
    *   Click "Enable".

3.  **Configure OAuth Consent Screen**:
    *   Go to "APIs & Services" > "OAuth consent screen".
    *   Choose **External** and click "Create".
    *   Fill in the required app information (app name, user support email, developer contact).
    *   On the "Scopes" page, you don't need to add any scopes.
    *   On the "Test users" page, click "+ ADD USERS" and add the Google account(s) you will use to test the application. **This is important, otherwise you will get an "access_denied" error.**

4.  **Create Credentials**:
    *   Go to "APIs & Services" > "Credentials".
    *   Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
    *   For "Application type", choose **Web application**.
    *   Give it a name (e.g., "Goal Calendar App Client").
    *   Under "Authorized redirect URIs", add `http://localhost:8000`.
    *   Click "CREATE".

5.  **Download Credentials File**:
    *   After creating the client ID, a dialog will show your credentials. Click **"DOWNLOAD JSON"**.
    *   Rename the downloaded file to `credentials.json`.
    *   Place this `credentials.json` file in the root directory of the project.

6.  **Run the App and Sync**:
    *   Start the app with `npm start`.
    *   Click the "Sync with Google" button.
    *   A Google sign-in window will appear. Log in with one of the test user accounts you added.
    *   Grant the app permission to access your calendar.

Your goals will now be synced to your primary Google Calendar.

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
- `credentials.json` — (Optional) Google API credentials for calendar sync.
- `token.json` — (Generated) Stores the Google API access token after successful authorization.
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
- [googleapis](https://www.npmjs.com/package/googleapis)

---

## Contact
For questions or feedback, open an issue or contact via GitHub.
