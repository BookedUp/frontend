import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css', '../../../../styles.css']
})
export class AdminNavBarComponent implements OnInit{
  isPopupVisible = false;

  role: string = '' ;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      this.role = result;
    })
  }

  onProfilePictureClick(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  onPopupClick(event: Event): void {
    if (this.isPopupVisible && event.target instanceof HTMLElement && event.target.hasAttribute('closable')) {
      this.isPopupVisible = false;
    }
  }

  navigateToManageProfile(): void {
    this.router.navigate(['/manage-profile'], { queryParams: { role: 'admin' } });
  }

  navigateToAmenities(): void {
    this.router.navigate(['/accommodation-requests'], { queryParams: { filter: 'all' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { queryParams: { role: 'admin' } });
  }

  logOut(): void {
    this.authService.logout().subscribe({
      next: (_) => {
        localStorage.removeItem('user');
        this.authService.setUser();
        this.router.navigate(['/']);
      }
    })
  }
}
