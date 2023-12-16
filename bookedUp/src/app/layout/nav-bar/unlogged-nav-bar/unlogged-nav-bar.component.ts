import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unlogged-nav-bar',
  templateUrl: './unlogged-nav-bar.component.html',
  styleUrls: ['./unlogged-nav-bar.component.css', '../../../../styles.css']
})
export class UnloggedNavBarComponent {
  constructor(private router: Router) {}

  navigateToLogIn(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
