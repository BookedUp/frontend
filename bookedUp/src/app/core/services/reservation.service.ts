// reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../model/Reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}`);
  }

  getCreatedReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}/created`);
  }

  getAcceptedReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}/accepted`);
  }

  getRejectedReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}/rejected`);
  }

  getCompletedReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}/completed`);
  }

  getCancelledReservationsByHostId(hostId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/host/${hostId}/cancelled`);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
