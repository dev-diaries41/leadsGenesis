// WebSocketService.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private static instance: WebSocketService;
  private socket!: Socket;

  private constructor() {
    if (!WebSocketService.instance) {
      this.socket = io(process.env.SERVER_URL || '');
      this.configureSocket(); // Additional socket configuration if needed
      WebSocketService.instance = this;
    }

    return WebSocketService.instance;
  }

  private configureSocket() {
    this.socket.on('connect', () => console.log('Socket connected'));
  }

  public disconnect() {
    this.socket.disconnect();
    console.log('Socket disconnected');
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }
}

export default WebSocketService;
