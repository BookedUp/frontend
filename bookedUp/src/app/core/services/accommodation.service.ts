// accommodation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accommodation } from '../model/Accommodation';
import { PriceChange } from '../model/PriceChange';
import { Amenity } from '../model/Amenity';

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  private apiUrl = 'http://localhost:8080/api/accommodations';

  constructor(private http: HttpClient) {}

  getAllAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(this.apiUrl);
  }

  getAccommodationById(id: number): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.apiUrl}/${id}`);
  }

  createAccommodation(accommodation: Accommodation): Observable<Accommodation> {
    return this.http.post<Accommodation>(this.apiUrl, accommodation);
  }

  updateAccommodation(id: number, accommodation: Accommodation): Observable<Accommodation> {
    return this.http.put<Accommodation>(`${this.apiUrl}/${id}`, accommodation);
  }

  deleteAccommodation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveAccommodation(id: number): Observable<Accommodation> {
    return this.http.put<Accommodation>(`${this.apiUrl}/${id}/confirmation`, {});
  }

  rejectAccommodation(id: number): Observable<Accommodation> {
    return this.http.put<Accommodation>(`${this.apiUrl}/${id}/rejection`, {});
  }

  getAllModifiedAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}/modified`);
  }

  getAllCreatedAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}/created`);
  }

  getAllChangedAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}/changed`);
  }

  searchAccommodations(
    location?: string,
    guestsNumber?: number,
    startDate?: Date,
    endDate?: Date,
    amenities?: Amenity[],
    minPrice?: number,
    maxPrice?: number
  ): Observable<Accommodation[]> {
    const params: any = {
      location,
      guestsNumber,
      startDate,
      endDate,
      amenities: amenities || [],
      minPrice: minPrice || 0.0,
      maxPrice: maxPrice || 0.0
    };
    return this.http.get<Accommodation[]>(`${this.apiUrl}/search-filter`, { params });
  }


}
