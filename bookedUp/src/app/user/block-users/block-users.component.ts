import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, concatMap, map, of } from 'rxjs';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import Swal from 'sweetalert2';
import { User } from '../model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-block-users',
  templateUrl: './block-users.component.html',
  styleUrls: ['./block-users.component.css']
})
export class BlockUsersComponent implements OnInit {
  users: Observable<User[]> = new Observable();
  filter: string = 'all';

  photoDict: { accId: number, url: string }[] = [];
  user: User[] = [];

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private photoService: PhotoService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.users = this.userService.getUsers();
      this.userService.getUsers().subscribe((results) => {
        this.user = results;
        this.loadPhotos();
    });
  }

  blockUser(id: number): void {
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
}