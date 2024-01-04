import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, concatMap, map, of } from 'rxjs';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import Swal from 'sweetalert2';
import { User } from '../model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent implements OnInit {
  users: Observable<User[]> = new Observable();
  selectedClass: string = 'all-accommodations';
  filter: string = 'all';

  photoDict: { accId: number, url: string }[] = [];
  user: User[] = [];

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private photoService: PhotoService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadUsers();
    });
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'changed-accommodations') {
      this.router.navigate(['/user-reports'], {queryParams: {filter: 'changed'}});
    } else if (className === 'new-accommodations') {
      this.router.navigate(['/user-reports'], {queryParams: {filter: 'new'}});
    } else {
      this.router.navigate(['/user-reports'], {queryParams: {filter: 'all'}});
    }
  }

  private loadUsers(): void {
    if (this.filter === 'all') {
      this.users = this.userService.getUsers();
      this.userService.getUsers().subscribe((results) => {
        this.user = results;
        this.loadPhotos();
      });
    } else if (this.filter === 'new') {
      this.users = this.userService.getBlockedUsers();
      this.userService.getBlockedUsers().subscribe((results) => {
        this.user = results;
        this.loadPhotos();
      });
    } else {
      this.users = this.userService.getReportedUsers();
      this.userService.getBlockedUsers().subscribe((results) => {
        this.user = results;
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


  approveAccommodation(id: number): void {
    // this.userService.approveAccommodation(id)
    //     .subscribe(
    //         (approvedReservation) => {
    //           Swal.fire({
    //             icon: 'success',
    //             title: 'Accommodation Approved!',
    //             text: 'The accommodation has been successfully approved.',
    //           }).then(() => {
    //             this.loadAccommodations();
    //           });
    //         },
    //         (error) => {
    //           // Handle error
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Error Approving Accommodation',
    //             text: `An error occurred: ${error.message}`,
    //           });
    //         }
    //     );
  }

  rejectAccommodation(id: number): void {
    // this.accommodationService.rejectAccommodation(id)
    //     .subscribe(
    //         (rejectedReservation) => {
    //           Swal.fire({
    //             icon: 'success',
    //             title: 'Accommodation Rejected!',
    //             text: 'The accommodation has been successfully rejected.',
    //           }).then(() => {
    //             this.loadAccommodations();
    //           });
    //         },
    //         (error) => {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Error Rejecting Accommodation',
    //             text: `An error occurred: ${error.message}`,
    //           });
    //         }
    //     );
  }


  loadPhotos() {
    this.user.forEach((acc) => {
      if (acc.profilePicture) {
        this.photoService.loadPhoto(acc.profilePicture).subscribe(
            (data) => {
              this.createImageFromBlob(data).then((url: string) => {
                if (acc.id) {
                  this.photoDict.push({accId: acc.id, url: url});
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
}