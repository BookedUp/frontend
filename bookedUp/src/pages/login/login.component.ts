import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles.css']
})
export class LoginComponent implements OnInit {
  isPasswordVisible: boolean = false;


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

    var alreadyHaveAn = document.getElementById("dontHaveAn");
    if (alreadyHaveAn) {
      alreadyHaveAn.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
