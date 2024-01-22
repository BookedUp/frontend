import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AccommodationDetailsComponent } from './accommodation-details.component';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { HostService } from 'src/app/user/host/host.service';
import { GuestService } from 'src/app/user/guest/guest.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStub } from 'src/app/mocks/router.stub';
import { mockUser4 } from 'src/app/mocks/user.service.mock';
import { of } from 'rxjs';
import { Role } from 'src/app/user/model/role.enum';
import Swal from 'sweetalert2';
import { AccommodationService } from '../accommodation.service';
import { mockAccommodation } from 'src/app/mocks/accommodation.service.mock';
import { CalendarComponent } from 'src/app/shared/calendar/calendar.component';

describe('AccommodationDetailsComponent', () => {
  let component: AccommodationDetailsComponent;
  let fixture: ComponentFixture<AccommodationDetailsComponent>;
  let el: HTMLElement;
  let swalFireSpy: jasmine.SpyObj<any>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let accommodationService: jasmine.SpyObj<AccommodationService>;
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
    guestService = jasmine.createSpyObj('GuestService', ['deleteGuest']);
    accommodationService = jasmine.createSpyObj('AccommodationService', ['getAccommodationById']);
    authService = jasmine.createSpyObj('AuthService', ['login', 'getUserID', 'isLoggedIn', 'getRole', 'getUsername']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [AccommodationDetailsComponent],
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
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();
    
    userService.getUser.and.returnValue(of(mockUser4));

    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    authService.getUsername.and.returnValue('test@example.com');
    
    authService.isLoggedIn.and.returnValue(true);

    accommodationService.getAccommodationById.and.returnValue(of(mockAccommodation));

    fixture = TestBed.createComponent(AccommodationDetailsComponent);
    swalFireSpy = spyOn(Swal, 'fire');
    
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call reserve method', () => {
    spyOn(component, 'onButtonClick');

    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();

    expect(component.onButtonClick).toHaveBeenCalled();
  });

  it('should call calendar method', () => {
    spyOn(component, 'handleCalendarClick');

    const calendarComponent = fixture.debugElement.query(By.directive(CalendarComponent));

    calendarComponent.triggerEventHandler('click', {});
    expect(component.handleCalendarClick).toHaveBeenCalled();
  });

  
  it('should show error message when calendarComponent is defined but totalPrice is 0', fakeAsync(() => {
    component.calendarComponent = { getSelectedRange: () => ({ start: new Date(), end: new Date() }) } as any;
    component.totalPrice = 0;
  
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();
  
    tick();
  
    const expectedText = 'You can not select this range, some dates are already reserved.';
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));
  

  it('should not navigate when calendarComponent is undefined', fakeAsync(() => {
    component.calendarComponent = undefined;
    component.totalPrice = 100;

    spyOn(component, 'onButtonClick');
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();
    
    tick();

    expect(Swal.fire).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));
  
  it('should navigate to create-reservation when calendarComponent is defined and totalPrice is not 0', fakeAsync(() => {
    component.calendarComponent = { getSelectedRange: () => ({ start: new Date(), end: new Date() }) } as any;
    component.totalPrice = 100;
  
    const routerComp = spyOn(component.router, 'navigate').and.callThrough();
  
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();  
    tick();
  
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(routerComp).toHaveBeenCalledWith(['/create-reservation', component.accommodationId], {
      queryParams: {
        startDate: jasmine.any(Date),
        endDate: jasmine.any(Date),
        totalPrice: 100,
        numberGuests: component.numberGuests,
        days: component.days
      }
    });
  }));
});

//ng test --include="**/accommodation-details.component.spec.ts"