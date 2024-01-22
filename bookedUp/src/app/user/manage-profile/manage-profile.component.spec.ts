import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ManageProfileComponent } from './manage-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { UserService } from '../user.service';
import { PhotoService } from '../../shared/photo/photo.service';
import { tap } from 'rxjs/operators';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Role } from '../model/role.enum';
import { Router } from '@angular/router';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterStub } from 'src/app/mocks/router.stub';
import { mockUsers, mockUser4, mockUser5 } from 'src/app/mocks/user.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { HostService } from '../host/host.service';
import { GuestService } from '../guest/guest.service';

describe('ManageProfileComponent', () => {
  let component: ManageProfileComponent;
  let fixture: ComponentFixture<ManageProfileComponent>;
  let el: HTMLElement;
  let swalFireSpy: jasmine.SpyObj<any>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let hostService: jasmine.SpyObj<HostService>;
  let guestService: jasmine.SpyObj<GuestService>;
  let router: jasmine.SpyObj<Router>;

  const setFormControlValue = (controlName?: string, value?: any) => {
    component.updateForm?.get('firstName')?.setValue('Ime')
    component.updateForm?.get('lastName')?.setValue('Prezime')
    component.updateForm?.get('email')?.setValue('test@example.com')
    component.updateForm?.get('streetAndNumber')?.setValue('Bulevar Oslobodjenja 5')
    component.updateForm?.get('city')?.setValue('Novi Sad')
    component.updateForm?.get('postalCode')?.setValue('21000')
    component.updateForm?.get('country')?.setValue('Srbija')
    component.updateForm?.get('phone')?.setValue(642527738)
    component.updateForm?.get('role')?.setValue(Role.Guest)
    component.updateForm?.get('password')?.setValue('sifra123')

    if(controlName){
      component.updateForm?.get(controlName)?.setValue(value);
    }
    fixture.detectChanges();
    tick();
  };

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['registerGuest','registerHost', 'createUser', 'getUsers', 'getUser', 'updateUser']);
    guestService = jasmine.createSpyObj('GuestService', ['deleteGuest']);
    hostService = jasmine.createSpyObj('HostService', ['deleteHost']);
    authService = jasmine.createSpyObj('AuthService', ['login', 'getUserID', 'isLoggedIn', 'getRole', 'getUsername','setUserState', 'logout', 'setUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ManageProfileComponent],
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
      ]
    }).compileComponents();
    
    userService.getUser.and.returnValue(of(mockUser4));

    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    authService.getUsername.and.returnValue('test@example.com');
    
    authService.isLoggedIn.and.returnValue(true);

    fixture = TestBed.createComponent(ManageProfileComponent);
    swalFireSpy = spyOn(Swal, 'fire');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call update method', () => {
    spyOn(component, 'updateUser');

    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();

    expect(component.updateUser).toHaveBeenCalled();
  });

  it('should call delete method', () => {
    spyOn(component, 'deleteUser');

    el = fixture.debugElement.query(By.css('#delete-button')).nativeElement;
    el.click();

    expect(component.deleteUser).toHaveBeenCalled();
  });

  it('should call handleFileButtonClick when "Choose Image" button is clicked', () => {
    spyOn(component, 'handleFileButtonClick');

    const buttonElement = fixture.debugElement.query(By.css('.custom-button')).nativeElement;
    buttonElement.click();

    expect(component.handleFileButtonClick).toHaveBeenCalled();
  });

  it('should make first name input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'firstName\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make last name input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'lastName\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make street and number input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'streetAndNumber\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make city input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'city\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make postalCode input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'postalCode\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make country input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'country\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make phone input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'phone\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make password input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'password\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make email input field disabled', () => {
    const emailControl = component.updateForm?.get('email');
    expect(emailControl?.disabled).toBeTrue();
  });

  it('should mark form as valid when all fields are filled correctly', fakeAsync(() => {
    setFormControlValue();
    expect(component.updateForm?.valid).toBeTrue();
  }));

  it('should mark form as invalid when first name field is empty', fakeAsync(() => {
    setFormControlValue('firstName', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when last name field is empty', fakeAsync(() => {
    setFormControlValue('lastName', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when street and number field is empty', fakeAsync(() => {
    setFormControlValue('streetAndNumber', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when city field is empty', fakeAsync(() => {
    setFormControlValue('city', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when postalCode field is empty', fakeAsync(() => {
    setFormControlValue('postalCode', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when country field is empty', fakeAsync(() => {
    setFormControlValue('country', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when phone field is empty', fakeAsync(() => {
    setFormControlValue('phone', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should mark form as invalid when password field is empty', fakeAsync(() => {
    setFormControlValue('password', '');
    expect(component.updateForm?.valid).toBeFalse();
  }));

  it('should show error message when validating is failed because of empty or invalid values in from', fakeAsync(() => {
    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    
    userService.updateUser.and.returnValue(throwError('Some error occurred'));

    component.updateForm?.get('firstName')?.setValue('Ime'); 
    component.updateForm?.markAsDirty();  
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();
    tick();

    const expectedText = 'An error occurred while updating user information.';
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));

  it('should show error message when validating is failed because there is no changes in form', fakeAsync(() => {
      authService.getUserID.and.returnValue(4);
      authService.getRole.and.returnValue(Role.Guest);
      authService.getUsername.and.returnValue('test@example.com');
      
      userService.updateUser.and.returnValue(of(mockUser4));
      el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
      el.click();
      tick();

      const expectedText = 'No changes detected.';
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));

  it('should show error message when updateUser fails on userService', fakeAsync(() => {
    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    
    userService.updateUser.and.returnValue(throwError('Some error occurred'));

    component.updateForm?.get('firstName')?.setValue('Ime'); 
    component.updateForm?.markAsDirty();  
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();
    tick();

    const expectedText = 'An error occurred while updating user information.';
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));

  it('should show success message when updateUser is successful', fakeAsync(() => {
    authService.getUserID.and.returnValue(4);
    authService.getRole.and.returnValue(Role.Guest);
    userService.updateUser.and.returnValue(of(mockUser4));
    

    component.updateForm?.get('firstName')?.setValue('Novo Ime');
    component.updateForm?.markAsDirty();
    
    el = fixture.debugElement.query(By.css('#save-button')).nativeElement;
    el.click();
    tick();

    const expectedText = 'User information has been successfully updated.';
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: expectedText }));
  }));

  it('should show success message when deleting guest is successful', fakeAsync(() => {
    authService.getUserID.and.returnValue(4);
    guestService.deleteGuest.and.returnValue(of(undefined));

    authService.logout.and.returnValue(of('Logout successful')); 
    authService.setUser.and.returnValue();

    el = fixture.debugElement.query(By.css('#delete-button')).nativeElement;
    el.click();
    tick();

    expect(authService.logout).toHaveBeenCalled();
  }));

  it('should show success message when deleting host is successful', fakeAsync(() => {
    userService.getUser.and.returnValue(of(mockUser5));

    authService.getUserID.and.returnValue(5);
    authService.getRole.and.returnValue(Role.Host);
    authService.getUsername.and.returnValue('test@example.com');
    hostService.deleteHost.and.returnValue(of(undefined));

    authService.logout.and.returnValue(of('Logout successful')); 
    authService.setUser.and.returnValue();

    el = fixture.debugElement.query(By.css('#delete-button')).nativeElement;
    el.click();
    tick();

    expect(authService.logout).toHaveBeenCalled();
  }));
});

//ng test --include="**/manage-profile.component.spec.ts"