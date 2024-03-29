import { Component, OnInit } from '@angular/core';
import { Reservation } from '../model/reservation.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../reservation.service';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
import Swal from 'sweetalert2';
import { ReservationStatus } from '../model/reservationStatus.enum';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit{
  
  reser!: Reservation;
  reservation: Observable<Reservation> = new Observable<Reservation>();

  pictureUrl: string = '';
  reservationId: number = 1;

  cancellation: boolean = true;

  constructor( private router: Router, private route: ActivatedRoute, private reservationService: ReservationService, private photoService: PhotoService, private accommodationService: AccommodationService, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      if ('id' in params) {
        this.reservationId = params['id'];
      }

      this.reservation =  this.reservationService.getReservationById(this.reservationId);
      this.reservationService.getReservationById(this.reservationId).subscribe((result) =>{
        this.reser = result;
        this.canCancel();
        this.loadPhotos();
      })

    });
  }

  cancelReservation(): void {
    Swal.fire({icon: 'success', title: 'Reservation cancelled successfully!', text: 'You will be redirected to the reservation page.',}).then(() => {
      this.router.navigate(['/my-reservations']);
    });   
  }

  canCancel(): void{
    if( this.reser.status == ReservationStatus.Accept ){
      const reservationStartDate = this.reser.startDate;

      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - reservationStartDate.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      
      if(this.reser.accommodation.cancellationDeadline > daysDifference){
        // console.log("Ovo je dozvoljen opseg: ", this.reser.accommodation.cancellationDeadline);
        // console.log("Ovo je razlika u danima: ", daysDifference);
        this.cancellation = false;
      }
    }else if( this.reser.status == ReservationStatus.Reject || this.reser.status == ReservationStatus.Cancelled || this.reser.status == ReservationStatus.Completed){
      this.cancellation = false;
    }
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
    const imageName = this.reser.accommodation.photos[0];
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'var(--color-orange)';
      case 'REJECTED':
        return 'var(--color-firebrick)';
      case 'ACCEPTED':
        return 'var(--color-seagreen-100)';
      case 'CANCELLED':
        return 'var(--color-firebrick)';
      case 'COMPLETED':
        return 'var(--blue-1)';
      default:
        return 'inherit'; // default color or 'inherit' if no match
    }
  }
  

}

