# Monaco Editor with Dart Language Server Protocol (LSP) Integration

This project demonstrates how to integrate the Monaco Editor with the Dart Language Server Protocol (LSP) using React, Vite, and WebSockets. It provides a fully functional web-based Dart code editor with real-time language features such as syntax highlighting, code completion, diagnostics, and more.

## 🚀 Features

- **Monaco Editor**: Rich, browser-based code editing experience.
- **Dart LSP Integration**: Real-time Dart language features powered by the official Dart Analysis Server.
- **WebSocket Communication**: Seamless communication between frontend and backend using WebSockets.
- **Automatic Reconnection**: Robust WebSocket connection handling with automatic reconnection.
- **React & Vite**: Modern frontend tooling with fast development server and hot module replacement (HMR).
- **ESLint Configuration**: Pre-configured ESLint rules for clean and maintainable JavaScript/JSX code.

## 📁 Project Structure

```
monaco_lsp/
├── backend/
│   ├── dart-lsp-proxy-server.js   # WebSocket proxy server connecting frontend to Dart LSP
│   └── server.js                  # Helper functions for Dart LSP client setup
├── public/
│   └── vite.svg                   # Default Vite logo
├── src/
│   ├── assets/
│   │   └── react.svg              # React logo asset
│   ├── App.css                    # Global CSS styles
│   ├── App.jsx                    # Main React component
│   ├── index.css                  # Root CSS styles
│   ├── main.jsx                   # React entry point
│   └── MonacoEditorComponent.jsx  # Monaco Editor component with Dart LSP integration
├── .gitattributes                 # Git attributes configuration
├── .gitignore                     # Git ignore rules
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies and scripts
├── README.md                      # Project documentation (this file)
└── vite.config.js                 # Vite configuration
```

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Dart SDK](https://dart.dev/get-dart) (for Dart LSP server)

## ⚙️ Installation

1. **Clone the repository**

```sh
git clone <your-repo-url>
cd monaco_lsp
```

2. **Install dependencies**

```sh
npm install
```

## ▶️ Running the Project

### Step 1: Start the Dart LSP Proxy Server

Navigate to the backend directory and start the WebSocket proxy server:

```sh
cd backend
node dart-lsp-proxy-server.js
```

This server listens on `ws://localhost:3000` and connects to the Dart Analysis Server.

### Step 2: Start the React Frontend

In another terminal, from the root directory, run:

```sh
npm run dev
```

This will start the Vite development server. Open your browser at:

```
http://localhost:5173
```

You should now see the Monaco Editor with Dart language features enabled.

## 🖥️ Usage

- Write Dart code directly in the Monaco Editor.
- Enjoy real-time language features such as:
  - Syntax highlighting
  - Code completion (triggered by `Ctrl+Space`)
  - Error diagnostics
  - Hover information
  - And more provided by Dart's official LSP.

## 🔧 Customization

### Editor Configuration

You can customize the Monaco Editor settings in [`src/MonacoEditorComponent.jsx`](src/MonacoEditorComponent.jsx):

```jsx
<Editor
  height="100vh"
  defaultLanguage="dart"
  theme="vs-dark"
  options={{
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: false },
  }}
/>
```

### Dart LSP Server Configuration

The Dart LSP server is started in [`backend/dart-lsp-proxy-server.js`](backend/dart-lsp-proxy-server.js):

```js
const dartProcess = spawn('dart', [
  'language-server',
  '--protocol=lsp',
  '--client-id', 'my-editor.my-plugin',
  '--client-version', '1.2',
  '--instrumentation-log-file=/tmp/dart-lsp-log.txt'
]);
```

You can adjust these parameters as needed.

## 🧹 Linting

Run ESLint to check your JavaScript/JSX code:

```sh
npm run lint
```

## 🚢 Building for Production

To build the project for production deployment, run:

```sh
npm run build
```

The optimized build will be available in the `dist` directory.

To preview the production build locally, run:

```sh
npm run preview
```

## 📚 Resources

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Dart Language Server Protocol](https://dart.dev/tools/lsp)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)

## 📄 License

This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for details.
