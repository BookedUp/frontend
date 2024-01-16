import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private apiUrl = 'http://localhost:8080';
  url: string = this.apiUrl + "/api/socket";
  restUrl:string = this.apiUrl + "/sendMessageRest";

  constructor(private http: HttpClient) { }

  post(data: Notification) {
    return this.http.post<Notification>(this.url, data)
      .pipe(map((data: Notification) => { return data; }));
  }

  postRest(data: Notification) {
    return this.http.post<Notification>(this.restUrl, data)
      .pipe(map((data: Notification) => { return data; }));
  }

}