import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accommodation-details',
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css', '../../styles.css']
})
export class AccommodationDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    var alreadyHaveAn = document.getElementById("frameContainer31");
    if (alreadyHaveAn) {
      alreadyHaveAn.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }

    var frameContainer1 = document.getElementById("frameContainer32");
    if (frameContainer1) {
      frameContainer1.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }

    var homeText = document.getElementById("homeText");
    if (homeText) {
      homeText.addEventListener("click", () => {
        this.router.navigate(['']);
      });
    }
  }
}
