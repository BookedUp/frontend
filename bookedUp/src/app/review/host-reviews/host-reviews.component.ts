import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, concatMap, map, of } from 'rxjs';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import Swal from 'sweetalert2';
import { Review } from '../model/review.model';
import { ReviewService } from '../review.service';
import {AuthService} from "../../infrastructure/auth/auth.service";

@Component({
  selector: 'app-host-reviews',
  templateUrl: './host-reviews.component.html',
  styleUrls: ['./host-reviews.component.css']
})
export class HostReviewsComponent implements OnInit {
  reviews: Observable<Review[]> = new Observable();
  selectedClass: string = 'all-accommodations';
  filter: string = 'all';

  photoDict: { accId: number, url: string }[] = [];
  review: Review[] = [];

  constructor(private reviewService: ReviewService, private router: Router, private route: ActivatedRoute, private photoService: PhotoService, private authService: AuthService) {
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
      this.router.navigate(['/host-reviews'], {queryParams: {filter: 'hosts'}});
    }else if (className === 'new-accommodations') {
      this.router.navigate(['/host-reviews'], {queryParams: {filter: 'accommodations'}});
    } else {
      this.router.navigate(['/host-reviews'], {queryParams: {filter: 'all'}});
    }
  }

  private loadUsers(): void {
    if (this.filter === 'all') {
      this.reviews = this.reviewService.getReviewsByHostId(this.authService.getUserID());
      this.reviewService.getReviewsByHostId(this.authService.getUserID()).subscribe((results) => {
        this.review = results;
        this.loadPhotos();
      });
    } else if (this.filter === 'accommodations') {
      this.reviews = this.reviewService.getAccommodationReviewsByHostId(this.authService.getUserID());
      this.reviewService.getAccommodationReviewsByHostId(this.authService.getUserID()).subscribe((results) => {
        this.review = results;
        this.loadPhotos();
      });
    } else {
      this.reviews = this.reviewService.getHostReviewsByHostId(this.authService.getUserID());
      this.reviewService.getHostReviewsByHostId(this.authService.getUserID()).subscribe((results) => {
        this.review = results;
        this.loadPhotos();
      });
    }
  }

  generateStars(rating: number | undefined): string[] {
    const stars: string[] = [];
    if(rating != undefined){
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
    return stars;
  }

  calculateDaysAgo(reviewDate: Date): number {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - reviewDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // convert milliseconds to days
    return daysDifference;
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
    //ovde treba neka logika da se pronadje guest koji je ostavio review, poenta je da se prikaze profila slika tog gosta, vrv neka funkcija na beku

    // this.review.forEach((acc) => {
    //   if () {
    //     this.photoService.loadPhoto(acc.profilePicture).subscribe(
    //         (data) => {
    //           this.createImageFromBlob(data).then((url: string) => {
    //             if (acc.id) {
    //               this.photoDict.push({accId: acc.id, url: url});
    //             }
    //           }).catch(error => {
    //             console.error("Greška prilikom konverzije slike ${imageName}:", error);
    //           });
    //         },
    //         (error) => {
    //           console.log("Doslo je do greske pri ucitavanju slike ${imageName}:", error);
    //         }
    //     );
    //   }
    // });
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
