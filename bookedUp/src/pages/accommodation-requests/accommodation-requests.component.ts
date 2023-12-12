import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accommodation-requests',
  templateUrl: './accommodation-requests.component.html',
  styleUrls: ['./accommodation-requests.component.css', '../../styles.css']
})
export class AccommodationRequestsComponent implements OnInit{
  stars: string[] = [];

  ngOnInit(): void {
    this.generateStars();
  }

  private generateStars() {
    const ratingElement = document.getElementById("reviews-average");
    const rating = parseFloat(ratingElement!.innerText);
    console.log(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        this.stars.push('★');
      } else if (i - 0.5 === rating) {
        this.stars.push('✯');
      } else {
        this.stars.push('☆');
      }
    }
  }
}
