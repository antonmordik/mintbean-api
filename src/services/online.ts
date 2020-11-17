import { WebSocket } from "https://deno.land/x/websocket/mod.ts";

export class Online {
  private participants: Record<string, WebSocket>;
  constructor() {
    this.participants = {};
  }

  public add(id: string, ws: WebSocket): void {
    this.participants[id] = ws;
  }

  public remove(id: string): void {
    delete this.participants[id];
  }

  public get(id: string): WebSocket | undefined {
    return this.participants[id];
  }

}