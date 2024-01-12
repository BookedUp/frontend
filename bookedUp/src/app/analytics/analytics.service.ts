import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AccommodationService } from '../accommodation/accommodation.service';
import { ReservationService } from '../reservation/reservation.service';

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

  // Function to get yearly analytics data
  getAllAnalytics(startDate: string, endDate: string, hostId: number): Observable<any[]> {
    console.log("prosledjeni datumi su: ", startDate, endDate);
    return this.accommodationService.getAllActiveAccommodationsByHostId(hostId).pipe(
      map((result) => {
        return result.map(acc => ({ name: acc.name, totalEarnings: 1000, totalReservations: 10 }));
      })
    );
  }

  // getAllAnalytics(startDate: string, endDate: string, hostId: number): Observable<AnalyticsData[]> {
  //   return this.accommodationService.getAllActiveAccommodationsByHostId(hostId).pipe(
  //     switchMap((accommodations) => {
  //       return this.reservationService.getCompletedReservationsByHostId(hostId).pipe(
  //         map((completedReservations) => {
  //           const analyticsData: AnalyticsData[] = accommodations.map(accommodation => {
  //             const matchingReservations = completedReservations.filter(reservation => 
  //               reservation.accommodation.name === accommodation.name &&
  //               this.isDateInRange(reservation.startDate.toISOString(), startDate, endDate) &&
  //               this.isDateInRange(reservation.endDate.toISOString(), startDate, endDate)
  //             );
  
  //             const totalEarnings = matchingReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
  //             const totalReservations = matchingReservations.length;
  
  //             return {
  //               name: accommodation.name,
  //               totalEarnings,
  //               totalReservations
  //             };
  //           });
  
  //           return analyticsData;
  //         })
  //       );
  //     })
  //   );
  // }
  
  // private isDateInRange(date: string, startDate: string, endDate: string): boolean {
  //   return date >= startDate && date <= endDate;
  // }
}
