import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css', '../../styles.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    var frameContainer = document.getElementById("resetLink");
    if (frameContainer) {
      frameContainer.addEventListener("click", () => {
        this.router.navigate(['/check-inbox']);
      });
    }

  }
}
