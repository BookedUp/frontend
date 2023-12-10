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

    var registrationStep2 = document.getElementById("registrationStep2");
    if (registrationStep2) {
      registrationStep2.addEventListener("click", () => {
        const guestRole = document.getElementById("guestRole");

        if (this.showHostText == true) {
          this.router.navigate(['/register-step-2'], { queryParams: { role: 'host' } });
        } else {
          this.router.navigate(['/register-step-2'], { queryParams: { role: 'guest' } });
        }
      });
    }

    var alreadyHaveAnRegistration = document.getElementById("alreadyHaveAnRegistration");
    if (alreadyHaveAnRegistration) {
      alreadyHaveAnRegistration.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }
  }

  toggleText() {
    this.showHostText = !this.showHostText;
  }
}
