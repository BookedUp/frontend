import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {Reservation} from "../model/reservation.model";
import {ReservationService} from "../reservation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../infrastructure/auth/auth.service";
import {ReservationStatus} from "../model/reservationStatus.enum";
import Swal from "sweetalert2";
import {PhotoService} from "../../shared/photo/photo.service";

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: Observable<Reservation[]> = new Observable<Reservation[]>();
  selectedClass: string = 'all-reservation';
  filter: string = 'all';
  photoDict: { accId: number, url: string }[] = [];
  res: Reservation[] = [];

  searchText: string = '';

    constructor(private reservationService: ReservationService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private photoService: PhotoService) { }

  protected readonly ReservationStatus = ReservationStatus;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadReservations();
      console.log(this.reservations);
    });
  }
  private loadReservations(): void {
    if (this.filter === 'all') {
      this.reservations = this.reservationService.getReservationsByGuestId(this.authService.getUserID());
      this.reservationService.getReservationsByGuestId(this.authService.getUserID()).subscribe((results) => {
        this.res = results;
        this.loadPhotos();
      });
    }
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

  getGuestsReservations() {
    this.selectedClass = 'all-reservation';
    this.router.navigate(['my-reservations'], { queryParams: { filter: 'all' } });
    this.reservations = this.reservationService.getReservationsByGuestId(this.authService.getUserID());
    this.reservationService.getReservationsByGuestId(this.authService.getUserID()).subscribe((results) => {
      this.res = results;
      this.loadPhotos();
    });
  }


  getGuestsReservationsByStatus(className: string, status: ReservationStatus) {
    this.selectedClass = className;
    if (className === 'waiting-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'waiting' } });
    } else if (className === 'accepted-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'accepted' } });
    } else if (className === 'rejected-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'rejected' } });
    } else if (className === 'finished-reservation') {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'finished' } });
    } else {
      this.router.navigate(['/my-reservations'], { queryParams: { filter: 'cancelled' } });
    }

    this.reservations = this.reservationService.getReservationsByStatusAndGuestId(this.authService.getUserID(), status);
    this.reservationService.getReservationsByStatusAndGuestId(this.authService.getUserID(), status).subscribe((results) => {
      this.res = results;
      this.loadPhotos();
    });
  }
  loadPhotos() {
    this.res.forEach((ress) => {
      this.photoService.loadPhoto(ress.accommodation.photos[0]).subscribe(
          (data) => {
            this.createImageFromBlob(data).then((url: string) => {
              if (ress.accommodation.id) {
                this.photoDict.push({accId: ress.accommodation.id, url: url});
              }
            }).catch(error => {
              console.error("Greška prilikom konverzije slike ${imageName}:", error);
            });
          },
          (error) => {
            console.log("Doslo je do greske pri ucitavanju slike ${imageName}:", error);
          }
      );
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

  getPhotoUrl(accId: number | undefined): string | undefined {
    const photo = this.photoDict.find((item) => item.accId === accId);
    return photo ? photo.url : '';
  }

  roundHalf(value: number | undefined): number | undefined {
    if (value) {
      return Math.round(value * 2) / 2;
    }
    return 0;
  }

    searchReservations() {
        if (this.searchText.trim() === '') {
            this.loadReservations();
        } else {
            const filteredReservations = this.res.filter((ress) =>
                this.containsSearchText(ress, this.searchText)
            );
            this.reservations = of(filteredReservations);
        }
    }

    private containsSearchText(reservation: Reservation, searchText: string): boolean {
        return (
            reservation.accommodation.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }
}

