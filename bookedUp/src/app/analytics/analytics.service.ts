import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AccommodationService } from '../accommodation/accommodation.service';
import { ReservationService } from '../reservation/reservation.service';
import { ReservationStatus } from '../reservation/model/reservationStatus.enum';

interface AnalyticsData {
  name: string;
  totalEarnings: number;
  totalReservations: number;
}
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  

  constructor( private accommodationService: AccommodationService, private reservationService: ReservationService ){}

  getAllAnalytics(startDate: string, endDate: string, hostId: number): Observable<AnalyticsData[]> {
    return this.accommodationService.getAllActiveAccommodationsByHostId(hostId).pipe(
      switchMap((accommodations) => {
        return this.reservationService.getReservationsByStatusAndHostId(hostId, ReservationStatus.Completed).pipe(
          map((completedReservations) => {
            const analyticsData: AnalyticsData[] = accommodations.map(accommodation => {
              const matchingReservations = completedReservations.filter(reservation => 
                reservation.accommodation.name === accommodation.name &&
                this.isDateInRange(this.formatDate(new Date(reservation.startDate)), startDate, endDate) &&
                this.isDateInRange(this.formatDate(new Date(reservation.endDate)), startDate, endDate)
              );
  
              const totalEarnings = matchingReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
              const totalReservations = matchingReservations.length;
  
              return {
                name: accommodation.name,
                totalEarnings,
                totalReservations
              };
            });
  
            return analyticsData;
          })
        );
      })
    );
  }
  
  private isDateInRange(date: string, startDate: string, endDate: string): boolean {
    return date >= startDate && date <= endDate;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
