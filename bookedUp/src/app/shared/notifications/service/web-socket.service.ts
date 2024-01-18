import { Injectable } from '@angular/core';
import { Notification } from '../model/notification.model';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  
  private stompClient: Stomp.Client | undefined;
  hasWebSocketNotification: Observable<boolean> = of(false);

  constructor(private http: HttpClient,
  private authService: AuthService) {
  }

  connectToWebSocket(): void {
    const socket = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      if (this.stompClient !== undefined) {
        this.stompClient.subscribe('/topic/messages', (message) => {
          this.handleWebSocketMessage(message);
        });
      }
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  private handleWebSocketMessage(message: Stomp.Message): void {
    console.log('Received message: ' + message.body);
    if (Number(message.body) === this.authService.getUserID()) {
      this.hasWebSocketNotification = of(true);
    }
  }

  sendMessageUsingSocket(notification: Notification) {
    const socket = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(socket);
  
    this.stompClient.connect({}, (frame) => {
      const userId = 2;
      if(userId != undefined && this.stompClient !== undefined){
        this.stompClient.send('/app/send/message', {}, userId.toString());
      }
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  disconnectFromWebSocket(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }
}
