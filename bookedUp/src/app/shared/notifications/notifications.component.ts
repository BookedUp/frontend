import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { NotificationsService } from './service/notifications.service';
import { Notification } from './model/notification.model';

import { Host } from 'src/app/user/model/host.model';
import { Guest } from 'src/app/user/model/guest.model';
import { Role } from 'src/app/user/model/role.enum';
import { GuestService } from 'src/app/user/guest/guest.service';
import { HostService } from 'src/app/user/host/host.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{

  isSettingsVisible: boolean = false;

  notifications$: Observable<Notification[]> = new Observable<Notification[]>;
  host: Host | undefined;
  guest: Guest | undefined;
  loggedUserGuest: boolean = false;


  constructor(
    private authService: AuthService, 
    private guestService: GuestService, 
    private hostService: HostService,
    private route: ActivatedRoute, 
    private notificationService: NotificationsService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadNotifications();
    });

    if("ROLE_GUEST" === this.authService.getRole()){
      this.guestService.getGuestById(this.authService.getUserID())
      .subscribe((guest: Guest) => {
        this.guest = guest;
        this.loggedUserGuest = true;
      });
    }else if("ROLE_HOST" === this.authService.getRole()){
      this.hostService.getHost(this.authService.getUserID())
      .subscribe((host: Host) => {
        this.host = host;
      });
    }
  }

  private loadNotifications() : void {
    this.notifications$ = this.notificationService.getEnabledNotificationsByUserId(this.authService.getUserID())
    .pipe(
      map(notifications => notifications.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
      }))
    );
  }

  changeView(): void {
    this.isSettingsVisible = true;
  }

  changeViewToNotification(): void {
    this.isSettingsVisible = false;
  }

  calculateTimeAgo(date: Date | string | undefined): string {
    if (!date) {
      console.error('Date is undefined or null');
      return 'N/A';
    }

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date string');
      return 'N/A';
    }

    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - parsedDate.getTime();
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);

    if (hoursAgo >= 24) {
      return this.calculateDaysAgo(currentDate, parsedDate);
    } else if (hoursAgo > 0) {
      return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  }

  private calculateDaysAgo(currentDate: Date, parsedDate: Date): string {
    const daysAgo = Math.floor((currentDate.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo === 1) {
      return 'Yesterday';
    } else {
      return `${daysAgo} days ago`;
    }
  }
}
