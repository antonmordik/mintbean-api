import { WebSocket, WebSocketServer } from 'https://deno.land/x/websocket/mod.ts';

const wss = new WebSocketServer(8080);

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log(message);
    ws.send(message)
  });
});