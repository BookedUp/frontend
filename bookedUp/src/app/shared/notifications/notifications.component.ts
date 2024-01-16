import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { NotificationsService } from './service/notifications.service';
import { Notification } from './model/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{
  
  filter: string = 'all-text';
  selectedClass: string = 'all-text';
  notifications: Observable<Notification[]> = new Observable<Notification[]>;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private notificationService: NotificationsService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filter = params['notificationFilter'] || 'all-text';
      this.loadNotifications();
    });
  }

  private loadNotifications() : void {
    if (this.filter === 'all-text') {
      console.log("This is history");
      this.notifications = this.notificationService.getNotificationsByUserId(this.authService.getUserID())
      .pipe(
        map(notifications => notifications.sort((a, b) => {
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampB - timestampA;
        }))
      );
    }else{
      console.log("This is Web Socket");
      this.notifications = this.notificationService.getNotificationsByUserId(this.authService.getUserID());
    }
  }

  changeStyle(className: string): void {
    this.selectedClass = className;
    this.filter = className;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { notificationFilter: className },
      queryParamsHandling: 'merge',
    });
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
