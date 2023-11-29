import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', '../../styles.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    var alreadyHaveAn = document.getElementById("frameContainer");
    if (alreadyHaveAn) {
      alreadyHaveAn.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }

    var frameContainer1 = document.getElementById("frameContainer1");
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

    var rectangleImage = document.getElementById("rectangleImage");
    if (rectangleImage) {
      rectangleImage.addEventListener("click", () => {
        this.router.navigate(['/accommodation-details']);
      });
    }

    var frameContainer19 = document.getElementById("frameContainer19");
    if (frameContainer19) {
      frameContainer19.addEventListener("click", () => {
        this.router.navigate(['/accommodation-details']);
      });
    }
  }
}
