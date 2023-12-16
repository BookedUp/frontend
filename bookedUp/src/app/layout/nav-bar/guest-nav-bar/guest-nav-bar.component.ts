import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-guest-nav-bar',
  templateUrl: './guest-nav-bar.component.html',
  styleUrls: ['./guest-nav-bar.component.css', '../../../../styles.css']
})
export class GuestNavBarComponent implements OnInit{
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
    this.router.navigate(['/manage-profile'], { queryParams: { role: 'guest' } });
  }

  navigateToMyReservations(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToFavourites(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToReviews(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
  }

  navigateToHome(): void {
    this.router.navigate(['/'], { queryParams: { role: 'guest' } });
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
