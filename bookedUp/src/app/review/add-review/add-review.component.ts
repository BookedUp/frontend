import { Component } from '@angular/core';
import { ReviewService } from '../review.service';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Accommodation } from 'src/app/accommodation/model/accommodation.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Photo } from 'src/app/shared/model/photo.model';
import { UserService } from 'src/app/user/user.service';
import { Review } from '../model/review.model';
import Swal from 'sweetalert2';
import {Reservation} from "../../reservation/model/reservation.model";
import {ReservationService} from "../../reservation/reservation.service";

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent {

  acc!:Accommodation;
  accommodation: Observable<Accommodation> = new Observable<Accommodation>();
  rw!: Review;
  review: Observable<Review> = new Observable<Review>();

  pictureUrl: string = '';
  reviewId: number = 1;

  reservationId: number=1;
  res!: Reservation;
  reservation: Observable<Reservation> = new Observable<Reservation>();

  constructor( private router: Router, private route: ActivatedRoute, private reviewService: ReviewService, private photoService:PhotoService, private accommodationService: AccommodationService, private authService: AuthService, private reservationService: ReservationService) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if ('id' in params) {
                this.reservationId = params['id'];

                this.reservation =  this.reservationService.getReservationById(this.reservationId);
                this.reservationService.getReservationById(this.reservationId).subscribe((result) =>{
                    this.res = result;

                    // Provjerite da li postoji rezervacija i pridružite accommodation samo ako postoji
                    if (this.res && this.res.accommodation && this.res.accommodation.id) {
                        this.accommodation = this.accommodationService.getAccommodationById(this.res.accommodation.id);
                        this.accommodation.subscribe((accommodationResult) =>{
                            this.acc = accommodationResult;
                            this.loadPhotos();
                        });
                    } else {
                        console.error('Reservation data or accommodation information is missing.');
                    }
                });
            }
        });
    }


  onRatingClickedAccommodation(stars: number): void {
    console.log('Selected Stars Accommodation:', stars);
    // You can store the rating or perform any other actions here
  }

  onRatingClickedHost(stars: number): void {
    console.log('Selected Stars Host:', stars);
    // You can store the rating or perform any other actions here
  }


  saveReview(): void {
    Swal.fire({icon: 'success', title: 'Review submitted successfully!', text: 'You will be redirected to the review page.',}).then(() => {
      this.router.navigate(['/guest-reviews']);
    });
  }

  createImageFromBlob(imageBlob: Blob): Promise<string> {
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  }

  loadPhotos() {
    const imageName = this.acc.photos[0];
    this.photoService.loadPhoto(imageName).subscribe(
      (data) => {
        this.createImageFromBlob(data).then((url: string) => {
          this.pictureUrl = url;
        }).catch(error => {
          console.error("Greška prilikom konverzije slike ${imageName}:" , error);
        });
      },
      (error) => {
        console.log("Doslo je do greske pri ucitavanju slike ${imageName}:" , error);
      }
    );
  }

}
