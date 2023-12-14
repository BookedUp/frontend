import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../app/core/services/user.service';
import { User } from 'src/app/core/model/User';
import { Observable } from 'rxjs';
import { Role } from 'src/app/core/model/enum/Role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles.css']
})
export class LoginComponent implements OnInit {
  isPasswordVisible: boolean = false;
  users: User[] = [];


  constructor(private router: Router, private userService: UserService) { }

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
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        var logged: boolean = false;

        this.users.forEach(user => {
          console.log(user.email);
          if (email === user.email && password === user.password && user.active == true){
            logged = true;
            if (user.role == Role.Admin) {
              this.router.navigate(['/'], { queryParams: { role: 'admin' } });
            } else if (user.role == Role.Host) {
              this.router.navigate(['/'], { queryParams: { role: 'host' } });
            } else if (user.role == Role.Guest) {
              this.router.navigate(['/'], { queryParams: { role: 'guest' } });
            }
          }
        });

        if(logged == false){
          alert('Incorrect email or password');
        }
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );





  }

}
