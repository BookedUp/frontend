import { Component, OnInit  } from '@angular/core';
import { AccommodationService } from '../../accommodation/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from 'src/app/accommodation/model/accommodation.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {User} from "../../user/model/user.model";
import {UserService} from "../../user/user.service";
import { ReservationService } from '../reservation.service';
import { Reservation } from '../model/reservation.model';
import { ReservationStatus } from '../model/reservationStatus.enum';
import { Guest } from 'src/app/user/model/guest.model';
import { GuestService } from 'src/app/user/guest/guest.service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css']
})
export class CreateReservationComponent implements OnInit {

  reservationForm: FormGroup;
  accommodationId: number = 1;
  startDate!: string ;
  formattedStartDate: string | null = null;
  endDate!: string;
  formattedEndDate: string | null = null;
  totalPrice: number = 1;
  numberGuests: number = 0;
  status!: ReservationStatus;
  reservation! : Observable<Reservation>;
  createdStatus : string = "CREATED";
  acceptedStatus : string = "ACCEPTED";
  guest!: Guest;
  //accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  acc!: Accommodation;
  newReservation! : Reservation;
  nightNumber: number = 1;

  loggedUser!: User;

  constructor(private fb: FormBuilder,private userService: UserService, private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService, private authService: AuthService, private reservationService: ReservationService, private guestService: GuestService)
  {
    this.reservationForm = this.fb.group({
      firstName: [{value: '', disabled: true}],
      lastName: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
    });
  }

  ngOnInit(): void {


    this.route.params.subscribe((params) => {
      this.accommodationId = params['id'];


      this.accommodationService.getAccommodationById(this.accommodationId).subscribe(
          (acc: Accommodation) => {
            this.acc = acc;
          },
          (error) => {
            console.error('Error loading acc:', error);
          }
      );

      this.userService.getUser(this.authService.getUserID()).subscribe(
          (user: User) => {
            this.loggedUser = user;

            this.reservationForm!.setValue({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phone,
            });
          },
          (error) => {
            console.error('Error loading user:', error);
          }
      );

      this.guestService.getGuestById(this.authService.getUserID()).subscribe(
        (guest: Guest) => {
          this.guest = guest;
        },
        (error) => {
          console.error('Error loading guest:', error);
        }
      );



      this.route.queryParams.subscribe(queryParams => {
        this.startDate = queryParams['startDate'];
        const dateStart = new Date(this.startDate ?? new Date());
        this.formattedStartDate = new DatePipe('en-US').transform(dateStart, 'EEEE, MMMM d, y');

        this.endDate = queryParams['endDate'];
        const dateEnd = new Date(this.endDate ?? new Date());
        this.formattedEndDate = new DatePipe('en-US').transform(dateEnd, 'EEEE, MMMM d, y');

        this.totalPrice = queryParams['totalPrice'];
        this.numberGuests = queryParams['numberGuests'];
        this.nightNumber = queryParams['days'];



      });
    });
  }

  reserve() {
    let start = new Date(this.startDate);
    start.setHours(13,0,0,);
    let end = new Date(this.endDate);
    end.setHours(13,0,0,0);

    this.newReservation = {
      startDate: start,
      endDate : end,
      totalPrice : this.totalPrice,
      guestsNumber : this.numberGuests,
      accommodation : this.acc,
      guest : this.guest,
      status : this.acc.automaticReservationAcceptance ? this.acceptedStatus as ReservationStatus : this.createdStatus as ReservationStatus
    };

    
    this.reservationService.createReservation(this.newReservation).subscribe(
      (createdReservation: Reservation) => {
        console.log('Created Reservation:', createdReservation);
        alert("Successfully created a reservation!")
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error creating reservation:', error);
      }
    );
    
  }

  generateStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('★');
      } else if (i - 0.5 === rating) {
        stars.push('✯');
      } else {
        stars.push('☆');
      }
    }
    return stars;
  }

  roundHalf(value: number): number {
    return Math.round(value * 2) / 2;
  }
}
