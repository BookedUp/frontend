// reservation.model.ts
import { Time } from '@angular/common';
import { ReservationStatus } from '../model/enum/ReservationStatus';
import { Accommodation } from './Accommodation';
import { Guest } from './Guest';

export interface Reservation {
  id: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guestsNumber: number;
  accommodation: Accommodation;
  guest: Guest;
  status: ReservationStatus;
}
