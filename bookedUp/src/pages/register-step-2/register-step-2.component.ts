import { Component } from '@angular/core';

@Component({
  selector: 'app-register-step-2',
  templateUrl: './register-step-2.component.html',
  styleUrls: ['./register-step-2.component.css', '../../styles.css']
})
export class RegisterStep2Component {
  isPasswordVisible1: boolean = false;
  isPasswordVisible2: boolean = false;


  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }
  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }
}
