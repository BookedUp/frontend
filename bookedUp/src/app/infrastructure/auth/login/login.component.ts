import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Login} from "../model/login";
import {AuthResponse} from "../model/auth-response";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  isEmailRequiredActive: boolean = false;
  isPasswordRequiredActive: boolean = false;



  constructor(private authService: AuthService,
              private router: Router) {

  }

  //sta je ovo proveriti

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  login(): void {

    if(this.loginForm.valid) {
      const login: Login = {
        email: this.loginForm.value.username || "",
        password: this.loginForm.value.password || ""
      }
      this.authService.login(login).subscribe({
        next: (response: AuthResponse) => {
          localStorage.setItem('user', response.token);
          this.authService.setUser()
          this.router.navigate(['/'])
        }
      })
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onEmailInputFocus(): void {
    this.isEmailRequiredActive = true;
  }

  onEmailInputChange(): void {
    const usernameControl = this.loginForm.get('username');

    if (usernameControl && usernameControl.value) {
      if (usernameControl.value.trim() === '') {
        this.isEmailRequiredActive = true;
      } else {
        this.isEmailRequiredActive = false;
      }
    }
  }

  onPasswordInputFocus(): void {
    this.isPasswordRequiredActive = true;
  }

  onPasswordInputChange(): void {
    const usernameControl = this.loginForm.get('password');

    if (usernameControl && usernameControl.value) {
      if (usernameControl.value.trim() === '') {
        this.isPasswordRequiredActive = true;
      } else {
        this.isPasswordRequiredActive = false;
      }
    }
  }

}
