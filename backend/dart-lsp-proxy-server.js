import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import { Buffer } from 'buffer';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('[Backend] Frontend connected');

  const dartProcess = spawn('dart', [
    'language-server',
    '--protocol=lsp',
    '--client-id', 'my-editor.my-plugin',
    '--client-version', '1.2',
    '--instrumentation-log-file=/tmp/dart-lsp-log.txt'
  ]);

  console.log('[Backend] Dart LSP server started');

  let stdoutBuffer = '';

  dartProcess.stdout.on('data', (data) => {
    console.log('[Backend] Received data from Dart LSP server:', data.toString());
    stdoutBuffer += data.toString();

    while (true) {
      const headerEnd = stdoutBuffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) break;

      const header = stdoutBuffer.slice(0, headerEnd);
      const match = header.match(/Content-Length: (\d+)/i);
      if (!match) break;

      const contentLength = parseInt(match[1], 10);
      const messageStart = headerEnd + 4;
      const messageEnd = messageStart + contentLength;

      if (stdoutBuffer.length < messageEnd) break;

      const message = stdoutBuffer.slice(messageStart, messageEnd);
      console.log('[Backend] Sending message to frontend:', message);
      ws.send(message);

      stdoutBuffer = stdoutBuffer.slice(messageEnd);
    }
  });

  dartProcess.stderr.on('data', (data) => {
    console.error('[Backend] Dart LSP stderr:', data.toString());
  });

  ws.on('message', (message) => {
    console.log('[Backend] Received message from frontend:', message.toString());
    const json = message.toString();
    const contentLength = Buffer.byteLength(json, 'utf8');
    const lspMessage = `Content-Length: ${contentLength}\r\n\r\n${json}`;
    console.log('[Backend] Sending message to Dart LSP server:', lspMessage);
    dartProcess.stdin.write(lspMessage);
  });

  ws.on('close', () => {
    dartProcess.kill();
    console.log('[Backend] Frontend disconnected');
  });
});

console.log('[Backend] WebSocket proxy server running on ws://localhost:3000');