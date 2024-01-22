import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { CreateReservationComponent } from './create-reservation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccommodationService } from '../../accommodation/accommodation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from '../../user/user.service';
import { ReservationService } from '../reservation.service';
import { PhotoService } from '../../shared/photo/photo.service';
import { GuestService } from '../../user/guest/guest.service';
import { NotificationsService } from '../../shared/notifications/service/notifications.service';
import { WebSocketService } from '../../shared/notifications/service/web-socket.service';
import { Accommodation } from 'src/app/accommodation/model/accommodation.model';
import { User } from '../../user/model/user.model';
import { Guest } from '../../user/model/guest.model';
import { ReservationStatus } from '../model/reservationStatus.enum';
import { Reservation } from '../model/reservation.model';
import { NotificationType } from '../../shared/notifications/model/enum/notificationType.enum';
import Swal from 'sweetalert2';

describe('CreateReservationComponent', () => {
  let component: CreateReservationComponent;
  let fixture: ComponentFixture<CreateReservationComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockAccommodationService: any;
  let mockAuthService: any;
  let mockUserService: any;
  let mockReservationService: any;
  let mockPhotoService: any;
  let mockGuestService: any;
  let mockNotificationsService: any;
  let mockWebSocketService: any;

  beforeEach(async(() => {
    mockActivatedRoute = {
      params: of({ id: 1 }),
      queryParams: of({
        startDate: '2022-01-01',
        endDate: '2022-01-05',
        totalPrice: 100,
        numberGuests: 2,
        days: 5,
      }),
    };

    mockRouter = { navigate: jasmine.createSpy('navigate') };

    mockAccommodationService = {
      getAccommodationById: jasmine.createSpy('getAccommodationById').and.returnValue(of({} as Accommodation)),
    };

    mockAuthService = { getUserID: jasmine.createSpy('getUserID').and.returnValue('123') };

    mockUserService = {
      getUser: jasmine.createSpy('getUser').and.returnValue(of({} as User)),
    };

    mockReservationService = {
      createReservation: jasmine.createSpy('createReservation').and.returnValue(of({} as Reservation)),
    };

    mockPhotoService = {
      loadPhoto: jasmine.createSpy('loadPhoto').and.returnValue(of(new Blob())),
    };

    mockGuestService = {
      getGuestById: jasmine.createSpy('getGuestById').and.returnValue(of({} as Guest)),
    };

    mockNotificationsService = {
      createNotification: jasmine.createSpy('createNotification').and.returnValue(of({})),
    };

    mockWebSocketService = {
      sendMessageUsingSocket: jasmine.createSpy('sendMessageUsingSocket'),
    };

    TestBed.configureTestingModule({
      declarations: [CreateReservationComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: AccommodationService, useValue: mockAccommodationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: ReservationService, useValue: mockReservationService },
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: GuestService, useValue: mockGuestService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: WebSocketService, useValue: mockWebSocketService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accommodation data and user data on init', fakeAsync(() => {
    tick();

    expect(mockAccommodationService.getAccommodationById).toHaveBeenCalledWith(1);
    expect(mockUserService.getUser).toHaveBeenCalledWith(123);
    expect(mockGuestService.getGuestById).toHaveBeenCalledWith(123);
  }));

  it('should create reservation', fakeAsync(() => {
    spyOn(Swal, 'fire');
    spyOn(component, 'delayNavigation');

    component.reserve();
    tick();

    expect(mockReservationService.createReservation).toHaveBeenCalled();

    expect(component.delayNavigation).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should delay navigation', fakeAsync(() => {
    component.delayNavigation();
    tick(1000);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should have enabled input fields for user information', () => {
    const firstNameInput = fixture.nativeElement.querySelector('input[formControlName="firstName"]');
    const lastNameInput = fixture.nativeElement.querySelector('input[formControlName="lastName"]');
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    const phoneNumberInput = fixture.nativeElement.querySelector('input[formControlName="phoneNumber"]');

    expect(firstNameInput.disabled).toBe(false);
    expect(lastNameInput.disabled).toBe(false);
    expect(emailInput.disabled).toBe(false);
    expect(phoneNumberInput.disabled).toBe(false);
  });

});

