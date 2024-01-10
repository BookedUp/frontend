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

  constructor( private router: Router, private route: ActivatedRoute, private reviewService: ReviewService, private photoService:PhotoService, private accommodationService: AccommodationService, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      if ('id' in params) {
        this.reviewId = params['id'];
      }

      this.review =  this.reviewService.getReview(this.reviewId);
      this.reviewService.getReview(this.reviewId).subscribe((result) =>{
        this.rw = result;
      })

      this.accommodation = this.accommodationService.getAccommodationById(1);
      this.accommodationService.getAccommodationById(1).subscribe((result) =>{
        this.acc = result;
        this.loadPhotos();
      })

      // this.accommodation = this.accommodationService.getAccommodationById(this.rw.accommodationDTO?.id || 0);
      // this.accommodationService.getAccommodationById(this.rw.accommodationDTO?.id || 0).subscribe((result) =>{
      //   this.acc = result;
      //   this.loadPhotos();
      // })

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
