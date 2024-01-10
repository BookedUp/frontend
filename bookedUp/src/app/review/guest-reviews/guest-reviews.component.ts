import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from 'src/app/accommodation/model/accommodation.model';
import { ReviewService } from '../review.service';
import { Review } from '../model/review.model';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";
import {PhotoService} from "../../shared/photo/photo.service";

@Component({
  selector: 'app-guest-reviews',
  templateUrl: './guest-reviews.component.html',
  styleUrls: ['./guest-reviews.component.css']
})
export class GuestReviewsComponent implements OnInit {
  reviews: Observable<Review[]> = new Observable<Review[]>();
  selectedClass: string = 'all-accommodations';
  filter: string = 'all';

  photoDict: { accId: number, url: string }[] = [];
  review: Review[] = [];

  constructor(private reviewService: ReviewService, private accommodationService: AccommodationService, private router: Router, private route: ActivatedRoute, private photoService: PhotoService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadReviews();
    });
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'changed-accommodations') {
      this.router.navigate(['/guest-reviews'], {queryParams: {filter: 'waiting'}});
    } else if (className === 'new-accommodations') {
      this.router.navigate(['/guest-reviews'], {queryParams: {filter: 'posted'}});
    } else {
      this.router.navigate(['/guest-reviews'], {queryParams: {filter: 'all'}});
    }
  }

  private loadReviews(): void {
    if (this.filter === 'all') {
      this.reviews = this.reviewService.getReviews();
      this.reviewService.getReviews().subscribe((results) => {
        this.review = results;
        console.log("Reviews: ", results);
        //this.loadPhotos();
      });
    } else if (this.filter === 'posted') {

    } else {

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


  navigateTo(route: string, id: number): void {
    this.router.navigate([route, id]);
  }

  approveAccommodation(id: number): void {
    // this.accommodationService.approveAccommodation(id)
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


  // loadPhotos() {
  //   this.review.forEach((acc) => {
  //     this.photoService.loadPhoto(acc?.accommodation.photos[0]).subscribe(
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
  //   });
  // }


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
