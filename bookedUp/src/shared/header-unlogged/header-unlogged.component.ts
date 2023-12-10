import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-unlogged',
  templateUrl: './header-unlogged.component.html',
  styleUrls: ['./header-unlogged.component.css', '../../styles.css']
})
export class HeaderUnloggedComponent  {

  constructor(private router: Router) {}

  navigateToLogIn(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
