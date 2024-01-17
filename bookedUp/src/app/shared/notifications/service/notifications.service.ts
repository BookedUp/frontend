import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Notification } from '../model/notification.model';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

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

  private apiUrl = 'http://localhost:8080/api/notifications';

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  getNotificationsByUserId(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${id}`);
  }

  getEnabledNotificationsByUserId(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/enabled/${id}`);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  updateNotification(id: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, notification);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}