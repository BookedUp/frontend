import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../styles.css']
})
export class IndexComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    var frameContainer3 = document.getElementById("frameContainer3");
    if (frameContainer3) {
      frameContainer3.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }

    var frameContainer2 = document.getElementById("frameContainer2");
    if (frameContainer2) {
      frameContainer2.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }

  }
 }

