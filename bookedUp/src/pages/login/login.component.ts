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

    var continueEmail = document.getElementById("continueEmail");
    if (continueEmail) {
      continueEmail.addEventListener("click", () => {
        this.login();
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

  login() {
    const emailInput = document.querySelector('.email-address21') as HTMLInputElement;
    const passwordInput = document.querySelector('.enter-password4') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === 'admin' && password === 'admin') {
      // Redirect to the admin page
    this.router.navigate(['/'], { queryParams: { role: 'admin' } });
    } else if (email === 'host' && password === 'host') {
      // Redirect to the host page
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
    } else if (email === 'guest' && password === 'guest') {
      // Redirect to the guest page
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
    } else {
      alert('Incorrect email or password');
    }
  }

}
