import { Injectable } from '@angular/core';
import { Notification } from '../model/notification.model';

import * as Stomp from 'stompjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private baseUrl = 'http://localhost:8080';
  url: string = this.baseUrl + "/api/socket";
  restUrl: string = this.baseUrl + "/sendMessageRest";
  
  private stompClient: Stomp.Client | undefined;

  constructor(private http: HttpClient) { }

  sendMessageUsingSocket(notification: Notification) {
    this.stompClient!.send(this.baseUrl+"/socket-subscriber/send/message", {}, JSON.stringify(notification));
  }

  post(data: Notification) {
    return this.http.post<Notification>(this.url, data)
      .pipe(map((data: Notification) => { return data; }));
  }

  postRest(data: Notification) {
    return this.http.post<Notification>(this.restUrl, data)
      .pipe(map((data: Notification) => { return data; }));
  }
}
