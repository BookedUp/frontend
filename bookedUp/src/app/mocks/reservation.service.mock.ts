import { Reservation } from "../reservation/model/reservation.model";
import { ReservationStatus } from "../reservation/model/reservationStatus.enum";
import { mockAccommodation } from "./accommodation.service.mock";
import { mockGuest } from "./guest.service.mock";

export const mockReservation: Reservation = {
  id: 1,
  startDate: new Date('2024-02-04'),
  endDate: new Date('2024-02-06'),
  totalPrice: 200,
  guestsNumber: 3,
  accommodation: mockAccommodation,
  guest: mockGuest,
  status: ReservationStatus.Created,
};
