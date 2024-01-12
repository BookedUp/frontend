import {Host, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Guest} from "../model/guest.model";

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private apiUrl = 'http://localhost:8080/api/guests';

  constructor(private http: HttpClient) {}

  getGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl);
  }

  getGuestById(id: number): Observable<Guest> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Guest>(url);
  }

  createGuest(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.apiUrl, guest);
  }

  updateGuest(id: number, guest: Guest): Observable<Guest> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Guest>(url, guest);
  }

  deleteGuest(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  getHostsByGuestId(guestId: number): Observable<Host[]> {
    const url = `${this.apiUrl}/${guestId}/hosts`;
    return this.http.get<Host[]>(url);
  }
  // Dodajte ostale metode prema potrebi
}
