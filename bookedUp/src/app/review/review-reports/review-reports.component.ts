import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, concatMap, map, of } from 'rxjs';
import { PhotoService } from 'src/app/shared/photo/photo.service';
import Swal from 'sweetalert2';
import { Review } from '../model/review.model';
import { ReviewService } from '../review.service';
import {ReviewReportService} from "../review-report/review-report.service";

@Component({
  selector: 'app-review-reports',
  templateUrl: './review-reports.component.html',
  styleUrls: ['./review-reports.component.css']
})
export class ReviewReportsComponent implements OnInit {
  reviews: Observable<Review[]> = new Observable();
  selectedClass: string = 'all-accommodations';
  filter: string = 'all';

  photoDict: { accId: number, url: string }[] = [];
  review: Review[] = [];
  reportedReasons: string[] = [];

  constructor(private reviewService: ReviewService, private router: Router, private route: ActivatedRoute, private photoService: PhotoService, private reviewReportService: ReviewReportService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadReviews();
    });
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    if (className === 'new-accommodations') {
      this.router.navigate(['/review-reports'], {queryParams: {filter: 'reported'}});
    } else {
      this.router.navigate(['/review-reports'], {queryParams: {filter: 'all'}});
    }
  }

  private loadReviews(): void {
    if (this.filter === 'all') {
      this.reviews = this.reviewService.getUnapprovedReviews();
      this.reviewService.getUnapprovedReviews().subscribe((results) => {
        this.review = results;
        this.loadPhotos();
      });
    } else if (this.filter === 'reported') {
      this.reviews = this.reviewReportService.getReportedReviews();
      this.reviewReportService.getReportedReviews().subscribe((results) => {
        this.review = results;
        console.log(results);
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

  onApproveClick(reviewId: number): void {
    this.reviewService.approveReview(reviewId).subscribe(
      (approvedReview) => {
        Swal.fire({
          icon: 'success',
          title: 'Review Approved!',
          text: 'The review has been successfully approved.',
          confirmButtonText: 'OK'
        });
        this.loadReviews();
      },
      (error) => {
        console.error('Error approving review:', error);
      }
    );
  }

  showReportReasons(id: number): void {
    this.reviewReportService.getReportReasonsForReview(id)
        .subscribe((reasons: string[]) => {
          this.reportedReasons = reasons;
          this.showSwalWithReportedReasons(id);
        });
  }


  showSwalWithReportedReasons(reviewId: number): void {
    Swal.fire({
      title: 'Reported Reasons',
      html: this.generateReportedReasonsHtml(),
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Delete Review',
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.askForDeleteConfirmation(reviewId);
      }
    });
  }

  askForDeleteConfirmation(reviewId: number): void {
    this.reviewService.getReview(reviewId).subscribe(
        (review: Review) => {
          const reviewData = {
            comment: review.comment,
            date: review.date,
            guest: review.guest,
          };

          Swal.fire({
            title: 'Delete Review Confirmation',
            html: `
          <p>Review:</p>
          <p>Comment: ${reviewData.comment}</p>
          <p>Guest: ${reviewData.guest?.firstName} ${reviewData.guest?.lastName}</p>
        `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete review!',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              this.deleteReview(reviewId);
            }
          });
        },
        (error) => {
          console.error('Error getting review:', error);
        }
    );
  }

  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe(
        () => {
          this.loadReviews();
        },
        (error) => {
          console.error('Error deleting review:', error);
        }
    );
  }


  generateReportedReasonsHtml(): string {
    return this.reportedReasons.map((reason, index) => `
    <div style="margin-bottom: 8px;">
      <div style="border: 1px solid #ccc; padding: 8px; border-radius: 8px;">
        ${index + 1}. ${reason}
      </div>
    </div>`).join('');
  }


}
