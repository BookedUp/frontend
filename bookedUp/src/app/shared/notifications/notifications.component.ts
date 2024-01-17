import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { NotificationsService } from './service/notifications.service';
import { Notification } from './model/notification.model';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { User } from 'src/app/user/model/user.model';
import { UserService } from 'src/app/user/user.service';
import { Host } from 'src/app/user/model/host.model';
import { Guest } from 'src/app/user/model/guest.model';
import { Role } from 'src/app/user/model/role.enum';
import { GuestService } from 'src/app/user/guest/guest.service';
import { HostService } from 'src/app/user/host/host.service';
import { NotificationType } from './model/enum/notificationType.enum';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{

  filter: string = 'all-text';
  selectedClass: string = 'all-text';
  isNotificationVisible: boolean = true;

  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  host: Host | undefined;
  guest: Guest | undefined;

  serverUrl:string = 'http://localhost:8080/socket';
  private stompClient: Stomp.Client | undefined;


  constructor(private authService: AuthService, private guestService: GuestService, private hostService: HostService, private router: Router, private route: ActivatedRoute, private notificationService: NotificationsService) {
  }


  ngOnInit(): void {

    console.log('Component initialized');
    this.route.queryParams.subscribe(params => {
      this.filter = params['notificationFilter'] || 'all-text';
      this.loadNotifications();
    });

    if(Role.Guest === this.authService.getRole()){
      this.guestService.getGuestById(this.authService.getUserID())
      .subscribe((guest: Guest) => {
        this.guest = guest;
      });
    }else if(Role.Host === this.authService.getRole()){
      this.hostService.getHost(this.authService.getUserID())
      .subscribe((host: Host) => {
        this.host = host;
        this.host.accommodationRatingNotificationEnabled
      });
    }
  }

  private loadNotifications() : void {
    if (this.filter === 'all-text') {
      this.notifications$ = this.notificationService.getEnabledNotificationsByUserId(this.authService.getUserID())
      .pipe(
        map(notifications => notifications.sort((a, b) => {
          const timestampA = new Date(a.timestamp).getTime();
          const timestampB = new Date(b.timestamp).getTime();
          return timestampB - timestampA;
        }))
      );
    }else{
      this.initializeWebSocketConnection();
    }
  }

  initializeWebSocketConnection():void {
    let ws = new SockJS(this.serverUrl);

    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.openGlobalSocket()
    }, function (error) {
        console.log('Error: ' + error);
    });
  }

  openGlobalSocket() {
    if(this.stompClient){
      this.stompClient.subscribe("/socket-publisher", (notification: { body: string; }) => {
        this.handleResult(notification);
      });
    }
  }

  handleResult(notification: { body: string }) {
    if (notification.body) {
      let notificationResult: Notification = JSON.parse(notification.body);
      const currentNotifications = this.notificationsSubject.value || [];
      const updatedNotifications = [...currentNotifications, notificationResult];
      this.notificationsSubject.next(updatedNotifications);
    }
  }

  navigateTo(route: string): void {
    this.isNotificationVisible = !this.isNotificationVisible;
    this.router.navigate([route]);
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
