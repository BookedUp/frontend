import { Component, OnInit  } from '@angular/core';
import { AccommodationService } from '../../accommodation/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from 'src/app/accommodation/model/accommodation.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css']
})
export class CreateReservationComponent implements OnInit {

  reservationForm: FormGroup;
  accommodationId: number = 1;
  startDate: string | null = null;
  formattedStartDate: string | null = null;
  endDate: string | null = null;
  formattedEndDate: string | null = null;
  totalPrice: number = 1;
  numberGuests: number = 0;
  accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  acc?: Accommodation | null;
  nightNumber: number = 1;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private accommodationService: AccommodationService, private authService: AuthService) 
  {
    this.reservationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accommodationId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        this.startDate = queryParams['startDate'];
        const dateStart = new Date(this.startDate ?? new Date());
        this.formattedStartDate = new DatePipe('en-US').transform(dateStart, 'EEEE, MMMM d, y');

        this.endDate = queryParams['endDate'];
        const dateEnd = new Date(this.endDate ?? new Date());
        this.formattedEndDate = new DatePipe('en-US').transform(dateEnd, 'EEEE, MMMM d, y');
        
        this.totalPrice = queryParams['totalPrice'];
        this.numberGuests = queryParams['numberGuests'];
      });
    });
    
    this.accommodation = this.accommodationService.getAccommodationById(this.accommodationId);

    this.accommodation.subscribe(data => {
      this.acc = data;
    });
    console.log("total ", this.totalPrice);

  }

  generateStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        console.log("tu sam");
        stars.push('★');
      } else if (i - 0.5 === rating) {
        console.log("tu sam");
        stars.push('✯');
      } else {
        console.log("tu sam");
        stars.push('☆');
      }
    }
    return stars;
  }

  roundHalf(value: number): number {
    return Math.round(value * 2) / 2;
  }
}
