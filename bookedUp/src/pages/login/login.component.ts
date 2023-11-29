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
    var alreadyHaveAn = document.getElementById("dontHaveAn");
    if (alreadyHaveAn) {
      alreadyHaveAn.addEventListener("click", () => {
        this.router.navigate(['/register']);
      });
    }

    var frameContainer = document.getElementById("frameContainer");
    if (frameContainer) {
      frameContainer.addEventListener("click", () => {
        this.router.navigate(['/user-main-page']);
      });
    }

    var forgotPasswordText = document.getElementById("forgotPasswordText");
    if (forgotPasswordText) {
      forgotPasswordText.addEventListener("click", () => {
        this.router.navigate(['/forgot-password']);
      });
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
