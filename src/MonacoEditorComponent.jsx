import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { CloseAction, ErrorAction } from 'vscode-languageclient';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { listen, WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';

function createLanguageClient(connection) {
  const client = new MonacoLanguageClient({
    name: 'Dart Language Client',
    clientOptions: {
      documentSelector: ['dart'],
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
      middleware: {
        provideCompletionItem: (document, position, context, token, next) => {
          console.log('[Frontend] provideCompletionItem triggered:', { document, position, context });
          return next(document, position, context, token);
        },
      },
    },
    connectionProvider: {
      get: () => Promise.resolve(connection),
    },
  });

  client.onReady().then(() => {
    console.log('[Frontend] Monaco Language Client is ready');
  });

  client.onNotification((method, params) => {
    console.log('[Frontend] Notification received:', method, params);
  });

  client.onRequest((method, params) => {
    console.log('[Frontend] Request received:', method, params);
  });

  return client;
}

function createWebSocket(url) {
  return new ReconnectingWebSocket(url, [], {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
  });
}

function MonacoEditorComponent() {
  const editorRef = useRef(null);
  const [code, setCode] = useState(`import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.blue),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;

  const MyHomePage({super.key, required this.title});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`);

  useEffect(() => {
    const url = 'ws://localhost:3000';
    const reconnectingWebSocket = createWebSocket(url);

    reconnectingWebSocket.addEventListener('open', () => {
      console.log('[Frontend] WebSocket connection opened');
    });

    reconnectingWebSocket.addEventListener('close', () => {
      console.log('[Frontend] WebSocket connection closed');
    });

    reconnectingWebSocket.addEventListener('error', (error) => {
      console.error('[Frontend] WebSocket error:', error);
    });

    listen({
      webSocket: toSocket(reconnectingWebSocket),
      onConnection: (connection) => {
        console.log('[Frontend] LSP connection established');

        const reader = new WebSocketMessageReader(connection);
        const writer = new WebSocketMessageWriter(connection);

        reader.listen((message) => {
          console.log('[Frontend] Received message from backend:', message);
        });

        const languageClientConnection = { reader, writer };
        const languageClient = createLanguageClient(languageClientConnection);
        languageClient.start();

        reader.onClose(() => {
          languageClient.stop();
          console.log('[Frontend] LSP connection closed');
        });
      },
    });

    return () => {
      reconnectingWebSocket.close();
      console.log('[Frontend] WebSocket connection cleanup');
    };
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    console.log('[Frontend] Monaco Editor mounted');

    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        console.log('[Frontend] Ctrl+Space pressed');
      }
    });
  }

  return (
    <Editor
      height="100vh"
      defaultLanguage="dart"
      theme="vs-dark"
      value={code}
      onChange={(value) => {
        setCode(value);
      }}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
        minimap: { enabled: false },
      }}
      onMount={handleEditorDidMount}
    />
  );
}

export default MonacoEditorComponent;