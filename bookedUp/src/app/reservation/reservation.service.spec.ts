import { TestBed } from '@angular/core/testing';

import { ReservationService } from './reservation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockReservation } from '../mocks/reservation.service.mock';
import { HttpResponse } from '@angular/common/http';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ReservationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle empty response from the server - Negative Test Case', () => {
    service.createReservation(mockReservation).subscribe(
        () => {
            fail('Expected success, but got an empty response');
        },
        (error) => {
            expect(error.status).toEqual(400);
            expect(error.statusText).toEqual('Bad Request');
        }
    );

    const req = httpController.expectOne({
        method: 'POST',
        url: `http://localhost:8080/api/reservations`,
    });

    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should call create reservation - Positive Test Case', () => {

    service.createReservation(mockReservation).subscribe((res) => {
      expect(res).toEqual(mockReservation);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `http://localhost:8080/api/reservations`,
    });

    req.flush(mockReservation);

    httpController.verify();
  });
});

//ng test --include="**/reservation.service.spec.ts"