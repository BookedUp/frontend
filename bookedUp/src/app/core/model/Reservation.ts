// reservation.model.ts
import { Time } from '@angular/common';
import { ReservationStatus } from '../model/enum/ReservationStatus';
import { Accommodation } from './Accommodation';
import { Guest } from './Guest';

export interface Reservation {
  id: number;
  accommodation: Accommodation;
  startDate: Date;
  endDate: Date;
  guestsNumber: number;
  totalPrice: number;
  status: ReservationStatus;
  active: boolean;
}