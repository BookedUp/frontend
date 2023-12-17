import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';
import {User} from "../../../user/model/user.model";

@Component({
  selector: 'app-host-nav-bar',
  templateUrl: './host-nav-bar.component.html',
  styleUrls: ['./host-nav-bar.component.css', '../../../../styles.css']
})
export class HostNavBarComponent implements OnInit{
  isPopupVisible = false;

  role: string = '' ;
  loggedUser!: User;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      this.role = result;
    })

    this.userService.getUser(this.authService.getUserID()).subscribe(
        (user: User) => {
          this.loggedUser = user;
        },
        (error) => {
          console.error('Error loading user:', error);
          // Handle error as needed
        }
    );
  }

  onProfilePictureClick(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  onPopupClick(event: Event): void {
    if (this.isPopupVisible && event.target instanceof HTMLElement && event.target.hasAttribute('closable')) {
      this.isPopupVisible = false;
    }
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
