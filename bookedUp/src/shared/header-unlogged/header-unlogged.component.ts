import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-unlogged',
  templateUrl: './header-unlogged.component.html',
  styleUrls: ['./header-unlogged.component.css', '../../styles.css']
})
export class HeaderUnloggedComponent implements OnInit {

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
