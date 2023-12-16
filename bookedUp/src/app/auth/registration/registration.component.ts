import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../core/model/enum/Role";
import {User} from "../../core/model/User";


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
    address: new FormControl('', Validators.required),
    phone: new FormControl(0, Validators.required),
    role: new FormControl(Role.Guest), // Postavite početnu vrednost na Role.Host
  });

  toggleText() {
    this.showHostText = !this.showHostText;
    const newRole = this.showHostText ? Role.Host : Role.Guest;
    this.registrationForm.get('role')?.setValue(newRole);
  }

  register() {
    if (this.registrationForm.valid) {
      const user: User = {
        firstName: this.registrationForm.value.firstName || '',
        lastName: this.registrationForm.value.lastName || '',
        address: {
          country: this.registrationForm.value.address || '',
          city: this.registrationForm.value.address || '',
          postalCode: this.registrationForm.value.address || '',
          streetAndNumber: this.registrationForm.value.address|| '',
          latitude: 0,
          longitude: 0
        },
        phone: this.registrationForm.value.phone || 0,
        email: this.registrationForm.value.email || '',
        password: 'sifra', //this.registrationForm.value.password, // Postavite šifru ako je potrebno
        role: this.registrationForm.value.role || Role.Guest,
      };

      this.authService.register(user).subscribe({
        next: (registeredUser: User) => {
          console.log('Uspešno registrovan korisnik:', registeredUser);
          //popup da se ode na mejl da proveri
          this.router.navigate(['/']) //moze na tu stranicu

          // Ovde možete dodati dalje korake, na primer, preusmeravanje na drugu stranicu
        },
        error: (error) => {
          console.error('Greška prilikom registracije:', error);
          // Ovde možete dodati odgovarajući tretman greške
        }
      });
    }
  }
}