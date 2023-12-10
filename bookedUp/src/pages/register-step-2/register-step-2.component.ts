import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-step-2',
  templateUrl: './register-step-2.component.html',
  styleUrls: ['./register-step-2.component.css', '../../styles.css']
})
export class RegisterStep2Component implements OnInit {

  userRole: string = 'none';
  isPasswordVisible1: boolean = false;
  isPasswordVisible2: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var createAccount = document.getElementById("createAccount");
    if (createAccount) {
      createAccount.addEventListener("click", () => {
        this.route.queryParams.subscribe(params => {
          this.userRole = params['role'] || 'guest';
  
          if (this.userRole === 'host') {
            this.router.navigate(['/'], { queryParams: { role: 'host' } })
          } else if (this.userRole === 'guest') {
            this.router.navigate(['/'], { queryParams: { role: 'guest' } });
          } else {
            alert('Invalid user role');
          }
        });
      });
    }
  }
  
  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }
  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }
}
