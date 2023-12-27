import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../infrastructure/auth/auth.service";
import {PhotoService} from "../../../shared/photo/photo.service";
import { ReservationStatus } from 'src/app/reservation/model/reservationStatus.enum';
import {UserService} from "../../user.service";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: Observable<User[]> = new Observable<User[]>();
  selectedClass: string = 'all-reservation';
  filter: string = 'all';
  res: User[] = [];
  photoDict: { accId: number, url: string }[] = [];

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private photoService: PhotoService) { }

  protected readonly ReservationStatus = ReservationStatus;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadUsers();
    });
  }
private loadUsers(): void {
    if (this.filter === 'all') {
    this.users = this.userService.getUsers();
    this.userService.getUsers().subscribe((results) => {
      this.res = results;
      this.loadPhotos();
    });
  }
}

  getUsers() {
    this.selectedClass = 'all-reservation';
    this.router.navigate(['users'], { queryParams: { filter: 'all' } });
    this.users = this.userService.getUsers();
    this.userService.getUsers().subscribe((results) => {
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

    // this.reservations = this.reservationService.getReservationsByStatusAndGuestId(this.authService.getUserID(), status);
    // this.reservationService.getReservationsByStatusAndGuestId(this.authService.getUserID(), status).subscribe((results) => {
    //   this.res = results;
    //   this.loadPhotos();
    // });
  }
  loadPhotos() {
    this.res.forEach((ress) => {
        if (ress.profilePicture) {
        this.photoService.loadPhoto(ress.profilePicture).subscribe(
            (data) => {
                this.createImageFromBlob(data).then((url: string) => {
                    if (ress.id) {
                        this.photoDict.push({accId: ress.id, url: url});
                    }
                }).catch(error => {
                    console.error("Greška prilikom konverzije slike ${imageName}:", error);
                });
            },
            (error) => {
                console.log("Doslo je do greske pri ucitavanju slike ${imageName}:", error);
            }
        );

    }
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



  roundHalf(value: number | undefined): number | undefined {
    if (value) {
      return Math.round(value * 2) / 2;
    }
    return 0;
  }
}

