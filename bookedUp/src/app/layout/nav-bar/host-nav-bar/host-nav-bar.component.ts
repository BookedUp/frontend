import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-nav-bar',
  templateUrl: './host-nav-bar.component.html',
  styleUrls: ['./host-nav-bar.component.css', '../../../../styles.css']
})
export class HostNavBarComponent implements OnInit{
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

  navigateToManageAccount(): void {
    this.router.navigate(['/manage-profile'], { queryParams: { role: 'host' } });
  }

  navigateToMyAmenities(): void {
    this.router.navigate(['/accommodations'], { queryParams: { role: 'host' } });
  }

  navigateToReservations(): void {
    this.router.navigate(['/reservation-requests'], { queryParams: { filter: 'all' },  });
  }

  navigateToComments(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToReports(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { queryParams: { role: 'host' } });
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
