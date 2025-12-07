# VS Code Setup & Usage Guide

This guide is designed to help you get the Activity Finder application up and running using **Visual Studio Code (VS Code)**.

## 1. Getting Started

### Open the Project
1. Launch **Visual Studio Code**.
2. Go to **File** > **Open Folder...**
3. Select the `basicapp` folder (the root directory of this repository).

### Recommended Extensions
To ensure the best coding experience, we recommend installing the following extensions. VS Code may ask you to install them automatically if you view the Extensions tab.

- **ESLint** (dbaeumer.vscode-eslint) - Finds and fixes problems in your JavaScript code.
- **Prettier - Code formatter** (esbenp.prettier-vscode) - Formats your code consistently.
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss) - Intelligence for CSS class names (if applicable).
- **Simple React Snippets** (burkeholland.simple-react-snippets) - Useful shorthand for React code.

## 2. Setting Up the Environment

This application has two parts: a **Frontend** (React) and a **Backend** (Node.js). You need to set up both.

### Using the Integrated Terminal
VS Code has a built-in terminal that makes running commands easy.

1. Open the terminal by pressing `Ctrl + ` ` (backtick) or going to **Terminal** > **New Terminal**.
2. You will see a terminal window appear at the bottom of the editor.

### Installation Steps

**Step 1: Install Frontend Dependencies**
In the terminal, make sure you are in the root `basicapp` folder, then run:
```bash
npm install
```

**Step 2: Install Backend Dependencies**
1. In the same terminal, navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend packages:
   ```bash
   npm install
   ```
3. Return to the root folder:
   ```bash
   cd ..
   ```

## 3. Running the Application

Since you need to run both the frontend and backend simultaneously, VS Code's **Split Terminal** feature is perfect for this.

### Start the Backend
1. Open a terminal (or use the existing one).
2. Create a specific backend terminal:
   ```bash
   cd backend
   npm start
   ```
   *You should see a message saying the server is running on port 3000.*

### Start the Frontend
1. Click the **Split Terminal** icon (a square split into two) in the top right of the terminal panel, or press `Ctrl + \` while focused on the terminal.
2. In this new side-by-side terminal, ensure you are in the root `basicapp` folder.
3. Run:
   ```bash
   npm run dev
   ```
   *You should see a message saying the app is running (usually at http://localhost:5173).*

## 4. Viewing the App
- **Browser**: Open your web browser (Chrome, Edge, Firefox) and verify the URL shown in the Frontend terminal (e.g., `http://localhost:5173`).
- **VS Code Simple Browser**: You can also use the Command Palette (`Ctrl + Shift + P`) and type `Simple Browser: Show`. Enter `http://localhost:5173` to view the app directly inside VS Code!

## 5. Troubleshooting (Common Issues)

- **"Command not found"**: Ensure you have Node.js installed on your computer. Setup checks path variables usually require a computer restart after installation.
- **Port already in use**: If you see an error about port 3000 or 5173 being busy, make sure you don't have another instance of the app running. You can stop a running terminal process by clicking in the terminal and pressing `Ctrl + C`.

## 6. Project Navigation
- **`src/`**: Contains all the React frontend code.
  - **`components/`**: Reusable UI pieces (Buttons, Maps, Cards).
  - **`pages/`**: Main screen layouts.
- **`backend/`**: Contains the Node.js server and database logic.
