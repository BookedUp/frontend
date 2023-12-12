import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css', '../../styles.css']
})
export class HeaderAdminComponent {

  isPopupVisible = false;

  constructor(private router: Router) {}

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

  navigateToDefault(): void {
    this.router.navigate(['/']);
  }
}
