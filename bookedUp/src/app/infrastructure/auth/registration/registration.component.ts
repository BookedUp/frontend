import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../../user/model/role.enum";
import {User} from "../../../user/model/user.model";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  showHostText = false;

  constructor(private authService: AuthService, private router: Router) { }

  registrationForm = new FormGroup({
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    streetNumber: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    phone: new FormControl(0, Validators.required),
    role: new FormControl(Role.Guest),
    password: new FormControl('', Validators.required),
  });

  toggleRole() {
    const currentRole = this.registrationForm.get('role')?.value;
    this.registrationForm.get('role')?.setValue(currentRole === Role.Host ? Role.Guest : Role.Host);
  }

  register() {
    if (this.registrationForm.valid) {
      const user: User = {
        firstName: this.registrationForm.value.firstName || '',
        lastName: this.registrationForm.value.lastName || '',
        address: {
          country: this.registrationForm.value.country || '',
          city: this.registrationForm.value.city || '',
          postalCode: this.registrationForm.value.postalCode || '',
          streetAndNumber: this.registrationForm.value.streetNumber || '',
          latitude: 0,
          longitude: 0
        },
        phone: this.registrationForm.value.phone || 0,
        email: this.registrationForm.value.email || '',
        password: this.registrationForm.value.password || '',
        role: this.registrationForm.value.role || Role.Guest,
      };

      this.authService.register(user).subscribe({
        next: (registeredUser: User) => {
          console.log('Successfully registered user!', registeredUser);
          this.router.navigate(['/check-inbox'])
        },
        error: (error) => {
          console.error('Error while registration: ', error);
        }
      });
    }
  }
}