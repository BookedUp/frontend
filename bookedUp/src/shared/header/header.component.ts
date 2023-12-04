import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    var frameContainer3 = document.getElementById("login");
    if (frameContainer3) {
      frameContainer3.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }

    var frameContainer2 = document.getElementById("register");
    if (frameContainer2) {
      frameContainer2.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }
  }
}
