import { ComponentFixture, TestBed, async, tick, fakeAsync, flushMicrotasks, flush } from '@angular/core/testing';
import { CreateReservationComponent } from './create-reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccommodationService } from '../../accommodation/accommodation.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { UserService } from '../../user/user.service';
import { ReservationService } from '../reservation.service';
import { GuestService } from '../../user/guest/guest.service';
import Swal from 'sweetalert2';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { RouterStub } from 'src/app/mocks/router.stub';
import { mockUser4 } from 'src/app/mocks/user.service.mock';
import { Role } from 'src/app/user/model/role.enum';
import { mockAccommodation } from 'src/app/mocks/accommodation.service.mock';
import { mockGuest } from 'src/app/mocks/guest.service.mock';
import { mockReservation } from 'src/app/mocks/reservation.service.mock';

describe('CreateReservationComponent', () => {
  let component: CreateReservationComponent;
  let fixture: ComponentFixture<CreateReservationComponent>;
  let el: HTMLElement;
  let swalFireSpy: jasmine.SpyObj<any>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let accommodationService: jasmine.SpyObj<AccommodationService>;
  let reservationService: jasmine.SpyObj<ReservationService>;
  let guestService: jasmine.SpyObj<GuestService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const activatedRouteStub = {
      params: of({ id: 1 }),
      queryParams: of({
        startDate: '2024-02-04',
        endDate: '2024-02-06',
        totalPrice: 300,
        numberGuests: 3,
        days: 2
      }),
      snapshot: {
        paramMap: convertToParamMap({ id: 1 })
      }
    };
    
    userService = jasmine.createSpyObj('UserService', ['registerGuest','registerHost', 'createUser', 'getUsers', 'getUser', 'updateUser']);
    guestService = jasmine.createSpyObj('GuestService', ['getGuestById']);
    reservationService = jasmine.createSpyObj('ReservationService', ['createReservation']);
    accommodationService = jasmine.createSpyObj('AccommodationService', ['getAccommodationById']);
    authService = jasmine.createSpyObj('AuthService', ['login', 'getUserID', 'isLoggedIn', 'getRole', 'getUsername']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CreateReservationComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        LayoutModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useClass: RouterStub },
        { provide: AuthService, useValue: authService },
        { provide: AccommodationService, useValue: accommodationService},
        { provide: ReservationService, useValue: reservationService},
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();
    
    userService.getUser.and.returnValue(of(mockUser4));

    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    authService.getUsername.and.returnValue('test@example.com');
    
    authService.isLoggedIn.and.returnValue(true);

    guestService.getGuestById.and.returnValue(of(mockGuest));

    accommodationService.getAccommodationById.and.returnValue(of(mockAccommodation));

    fixture = TestBed.createComponent(CreateReservationComponent);
    swalFireSpy = spyOn(Swal, 'fire');
    
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call reserve() on button click', fakeAsync(() => {
    const reserveSpy = spyOn(component, 'reserve');
  
    const buttonElement = fixture.debugElement.query(By.css('#completeBooking')).nativeElement;
    buttonElement.click();
  
    expect(reserveSpy).toHaveBeenCalled();
  }));

  it('should show error message on reservation creation failure', fakeAsync(() => {
    const createReservationSpy = reservationService.createReservation.and.returnValue(throwError('Fake error'));
  
    component.startDate = '2024-02-04';
    component.endDate = '2024-02-06';
    component.totalPrice = 200;
    component.numberGuests = 3;
    component.acc = mockAccommodation;
    component.guest = mockGuest;
  
    const buttonElement = fixture.debugElement.query(By.css('#completeBooking')).nativeElement;
    buttonElement.click();
  
    tick();
    flushMicrotasks();
    flush();
    
    const expectedText = 'Sorry, an error occurred while creating the reservation. Please try again later.';
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));
  

  it('should create reservation', fakeAsync(() => {
    const createReservationSpy = reservationService.createReservation.and.returnValue(of(mockReservation));
  
    component.startDate = '2024-02-04';
    component.endDate = '2024-02-06';
    component.totalPrice = 200;
    component.numberGuests = 3;
    component.acc = mockAccommodation;
    component.guest = mockGuest;
  
    const buttonElement = fixture.debugElement.query(By.css('#completeBooking')).nativeElement;
    buttonElement.click();
  
    tick();
    flushMicrotasks();
    flush();
  
    expect(createReservationSpy).toHaveBeenCalled();
  }));
});

//ng test --include="**/create-reservation.component.spec.ts"