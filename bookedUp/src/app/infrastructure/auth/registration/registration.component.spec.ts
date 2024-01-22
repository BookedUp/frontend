import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UserService } from 'src/app/user/user.service';
import { RouterStub } from 'src/app/mocks/router.stub';
import {BrowserModule, By} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MaterialModule } from '../../material/material.module';
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import { RegistrationComponent } from './registration.component';
import { Role } from 'src/app/user/model/role.enum';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegisterComponent', () => {

  let component: RegistrationComponent ;
  let fixture: ComponentFixture<RegistrationComponent>;
  let el: HTMLElement;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let swalFireSpy: jasmine.Spy<any>;

  const setFormControlValue = (controlName?: string, value?: any) => {
    component.registrationForm.get('firstName')?.setValue('Ime')
    component.registrationForm.get('lastName')?.setValue('Prezime')
    component.registrationForm.get('email')?.setValue('test@example.com')
    component.registrationForm.get('streetNumber')?.setValue('Bulevar Oslobodjenja 5')
    component.registrationForm.get('city')?.setValue('Novi Sad')
    component.registrationForm.get('postalCode')?.setValue('21000')
    component.registrationForm.get('country')?.setValue('Srbija')
    component.registrationForm.get('phone')?.setValue(642527738)
    component.registrationForm.get('role')?.setValue(Role.Guest)
    component.registrationForm.get('password')?.setValue('sifra123')
    component.registrationForm.get('passwordAgain')?.setValue('sifra123')

    if(controlName){
      component.registrationForm.get(controlName)?.setValue(value);
    }
    fixture.detectChanges();
    tick();
  };

  beforeEach(() => {
    const spyUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    
    TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: UserService, useValue: spyUserService },
        { provide: Router, useClass: RouterStub },
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(RegistrationComponent);
    userServiceMock = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    swalFireSpy = spyOn(Swal, 'fire');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register method', () => {
    spyOn(component, 'register');

    el = fixture.debugElement.query(By.css('#registerBtn')).nativeElement;
    el.click();

    expect(component.register).toHaveBeenCalled();
  });

  it('should make first name input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'firstName\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make last name input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'lastName\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make email input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'email\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should make street and number input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'streetNumber\']')).nativeElement;
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

  it('should make passwordAgain input field writable', () => {
    el = fixture.debugElement.query(By.css('[formcontrolname=\'passwordAgain\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should mark form as valid when all fields are filled correctly', fakeAsync(() => {
    setFormControlValue();
    expect(component.registrationForm.valid).toBeTrue();
  }));

  it('should mark form as invalid when first name field is emptyd', fakeAsync(() => {
    setFormControlValue('firstName', '');
    expect(component.registrationForm.valid).toBeFalse();

  }));

  it('should mark form as invalid when last name field is emptyd', fakeAsync(() => {
    setFormControlValue('lastName', '');
    expect(component.registrationForm.valid).toBeFalse();

  }));

  it('should mark form as invalid when email field is empty', fakeAsync(() => {
    setFormControlValue('email', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when street and number field is empty', fakeAsync(() => {
    setFormControlValue('streetNumber', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when city field is empty', fakeAsync(() => {
    setFormControlValue('city', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when postalCode field is empty', fakeAsync(() => {
    setFormControlValue('postalCode', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when country field is empty', fakeAsync(() => {
    setFormControlValue('country', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when phone field is empty', fakeAsync(() => {
    setFormControlValue('phone', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when password field is empty', fakeAsync(() => {
    setFormControlValue('password', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should mark form as invalid when passwordAgain field is empty', fakeAsync(() => {
    setFormControlValue('passwordAgain', '');
    expect(component.registrationForm.valid).toBeFalse();
  }));

  it('should toggle the role value', () => {
    expect(component.registrationForm.get('role')?.value).toEqual(Role.Guest);

    component.toggleRole();
    expect(component.registrationForm.get('role')?.value).toEqual(Role.Host);

    component.toggleRole();
    expect(component.registrationForm.get('role')?.value).toEqual(Role.Guest);
  });

  it('should mark form as invalid when passwordAgain is different from password', fakeAsync(() => {
    setFormControlValue('password', 'sifra1');
    setFormControlValue('passwordAgain', 'sifra2');
    const result = component.checkPasswordsMatch(component.registrationForm.value);
    expect(result).toBeFalse();
  }));
  
  it('should return true if user already exists', fakeAsync(() => {
    const sampleUser = {
      firstName: 'Ime',
      lastName: 'Prezime',
      email: 'test@example.com',
      streetNumber: 'Bulevar Oslobodjenja 5',
      city: 'Novi Sad',
      postalCode: '21000',
      country: 'Srbija',
      phone: 6425271738,
      role: Role.Guest,
      password: 'sifra123',
      passwordAgain: 'sifra123'
    };
  
    userServiceMock.getUsers.and.returnValue(of([sampleUser]));
    let result: boolean | undefined;
    component.isUserExist('test@example.com').subscribe(res => result = res);
    tick();
  
    expect(result).toBeTrue();
  }));
  
  it('should return false if user does not exist', fakeAsync(() => {
    userServiceMock.getUsers.and.returnValue(of([]));
    let result: boolean | undefined;
    component.isUserExist('test@example.com').subscribe(res => result = res);
    tick();
  
    expect(result).toBeFalse();
  }));

  it('should handle error on registration with invalid form values', fakeAsync(() => {
    const registerSpy = spyOn(component, 'register').and.callThrough();
    
    component.registrationForm.get('firstName')?.setValue('');
    
    el = fixture.debugElement.query(By.css('#registerBtn')).nativeElement;
    el.click();
    tick();
  
    expect(registerSpy).toHaveBeenCalled();
    
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Some fields are empty or have invalid values.', 'error');
  }));

  it('should handle successful user registration', fakeAsync(() => {

    const registerSpy = spyOn(component, 'register').and.callThrough();
    
    component.registrationForm.get('firstName')?.setValue('Ime')
    component.registrationForm.get('lastName')?.setValue('Prezime')
    component.registrationForm.get('email')?.setValue('test@example.com')
    component.registrationForm.get('streetNumber')?.setValue('Bulevar Oslobodjenja 5')
    component.registrationForm.get('city')?.setValue('Novi Sad')
    component.registrationForm.get('postalCode')?.setValue('21000')
    component.registrationForm.get('country')?.setValue('Srbija')
    component.registrationForm.get('phone')?.setValue(642527738)
    component.registrationForm.get('role')?.setValue(Role.Guest)
    component.registrationForm.get('password')?.setValue('sifra123')
    component.registrationForm.get('passwordAgain')?.setValue('sifra123')
  
    el = fixture.debugElement.query(By.css('#registerBtn')).nativeElement;
    el.click();
    tick();
  
    expect(registerSpy).toHaveBeenCalled();
    let result: boolean | undefined;
    spyOn(component, 'isUserExist').and.returnValue(of(false));
    component.isUserExist('test@example.com').subscribe(res => result = res);
    tick();
    expect(result).toBeFalse();
    const result2 = component.checkPasswordsMatch(component.registrationForm.value);
    expect(result2).toBeTrue();
    expect(component.registrationForm.valid).toBeTrue();

    //expect(Swal.fire).toHaveBeenCalledWith('Success', 'Successfully registered user!', 'success');
  }));
});


//ng test --include="**/registration.component.spec.ts"
