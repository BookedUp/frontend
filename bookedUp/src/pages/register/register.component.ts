// register.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../styles.css']
})
export class RegisterComponent implements OnInit {

  showHostText = false;

  constructor(private router: Router) { }

  ngOnInit() {

    var frameContainer = document.getElementById("frameContainer");
    if (frameContainer) {
      frameContainer.addEventListener("click", () => {
        const guestRole = document.getElementById("guestRole");

        if (guestRole && guestRole.style.display === 'none') {
          this.router.navigate(['/register-owner-step2']);
        } else {
          this.router.navigate(['/register-guest-step2']);
        }
      });
    }

    var alreadyHaveAn = document.getElementById("alreadyHaveAn");
    if (alreadyHaveAn) {
      alreadyHaveAn.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }
  }

  toggleText() {
    this.showHostText = !this.showHostText;
  }
}
