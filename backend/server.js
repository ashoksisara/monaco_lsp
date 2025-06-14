import { MonacoLanguageClient } from "monaco-languageclient";
import { CloseAction, ErrorAction } from "vscode-languageclient";
import ReconnectingWebSocket from "reconnecting-websocket";
import { listen, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";

/**
 * Creates the WebSocket URL based on the current location protocol.
 * Adjust the path if needed.
 */
function createUrl(path) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}${path}`;
}

/**
 * Creates a ReconnectingWebSocket instance.
 */
function createWebSocket(url) {
  return new ReconnectingWebSocket(url, [], {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
  });
}

/**
 * Creates a new Dart language client using the provided connection.
 */
function createLanguageClient(connection) {
  return new MonacoLanguageClient({
    name: "Dart Language Client",
    clientOptions: {
      documentSelector: ["dart"],
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
    },
    connectionProvider: {
      get: () => Promise.resolve(connection),
    },
  });
}

/**
 * Establishes the connection to the Dart Analysis/LSP server and starts the language client.
 */
export function createDartLanguageClient() {
  const url = createUrl("/dart");
  const webSocket = createWebSocket(url);

  listen({
    webSocket,
    onConnection: (connection) => {
      const reader = new WebSocketMessageReader(connection);
      const writer = new WebSocketMessageWriter(connection);
      const languageClientConnection = { reader, writer };

      const languageClient = createLanguageClient(languageClientConnection);
      languageClient.start();

      reader.onClose(() => languageClient.stop());
    },
  });
}