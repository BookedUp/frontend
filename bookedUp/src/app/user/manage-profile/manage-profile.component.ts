import { Component , OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../model/user.model";
import {UserService} from "../user.service";
import {AuthService} from "../../infrastructure/auth/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {tap} from "rxjs";

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit {

  isPasswordVisible: boolean = false;
  loggedUser!: User;
  updatedUser!: User;


  displayedImageUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  updateForm: FormGroup | undefined;


  constructor(private userService: UserService, private router: Router, private authService: AuthService, private formBuilder: FormBuilder,
  ) {
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{value: '', disabled: true}],
      password: ['', Validators.required],
      phone: [0, Validators.required],
      streetAndNumber: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUser(this.authService.getUserID()).subscribe(
        (user: User) => {
          this.loggedUser = user;

          this.updateForm!.setValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            phone: user.phone,
            streetAndNumber: user.address.streetAndNumber,
            city: user.address.city,
            postalCode: user.address.postalCode,
            country: user.address.country,
          });
        },
        (error) => {
          console.error('Error loading user:', error);
        }
    );
  }

  ngAfterViewInit() {
    this.fileInput.nativeElement.addEventListener('change', (event: any) => {

      const file = event.target.files[0];
      console.log('Nova slika dodata', event.target.files[0]);
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.displayedImageUrl = imageUrl;
      }
    });

  }

  handleFileButtonClick() {

    console.log('File button clicked');
    this.fileInput.nativeElement.click();
    console.log('After triggering click');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  updateUser() {
    if (this.validate()) {
      this.updatedUser = {
        id: this.authService.getUserID(),
        firstName: this.updateForm!.get('firstName')!.value,
        lastName: this.updateForm!.get('lastName')!.value,
        password: this.updateForm!.get('password')!.value,
        phone: this.updateForm!.get('phone')!.value,
        email: this.loggedUser.email,
        role: this.loggedUser.role,
        address: {
          streetAndNumber: this.updateForm!.get('streetAndNumber')!.value,
          city: this.updateForm!.get('city')!.value,
          postalCode: this.updateForm!.get('postalCode')!.value,
          country: this.updateForm!.get('country')!.value,
          latitude: 0,
          longitude: 0
        }
      };

      this.userService.updateUser(this.authService.getUserID(), this.updatedUser).pipe(
          tap((response) => {
            this.loggedUser = { ...this.loggedUser, ...this.updatedUser };
          })
      ).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'User Updated',
              text: 'User information has been successfully updated.',
            });
          },
          (error) => {
            console.error('Error updating user:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while updating user information.',
            });
          }
      );
    }
  }

  validate(): boolean {
    if (this.updateForm && this.updateForm.dirty) {
      const formValues = this.updateForm.value;

      const changesDetected =
          formValues.firstName !== this.loggedUser.firstName ||
          formValues.lastName !== this.loggedUser.lastName ||
          formValues.password !== this.loggedUser.password ||
          formValues.phone !== this.loggedUser.phone ||
          formValues.address.streetAndNumber !== this.loggedUser.address.streetAndNumber ||
          formValues.address.city !== this.loggedUser.address.city ||
          formValues.address.postalCode !== this.loggedUser.address.postalCode ||
          formValues.address.country !== this.loggedUser.address.country;

      if(!changesDetected){
        Swal.fire({
          icon: 'error',
          title: 'Validation failed',
          text: 'No changes detected.',
        });
        return false;

      }
      if (changesDetected && this.checkForEmptyValues() && this.updateForm.valid) {
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Validation failed',
          text: 'Some fields are empty or have invalid values.',
        });
        return false;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation failed',
        text: 'No changes detected.',

      });
      return false;
    }
  }

  checkForEmptyValues(): boolean {
    const formValues = this.updateForm!.value;

    return Object.values(formValues).every(value => {
      if (typeof value === 'string') {
        return value.trim() !== '';
      } else if (typeof value === 'number') {
        return value !== 0;
      } else {
        return true;
      }
    });
  }
}
