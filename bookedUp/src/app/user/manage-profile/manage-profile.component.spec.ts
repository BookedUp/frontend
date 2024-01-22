import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ManageProfileComponent } from './manage-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { UserService } from '../user.service';
import { PhotoService } from '../../shared/photo/photo.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Role } from '../model/role.enum';

describe('ManageProfileComponent', () => {
  let component: ManageProfileComponent;
  let fixture: ComponentFixture<ManageProfileComponent>;

  const mockAuthService = {
    getUserID: () => '123',
  };

  const mockUserService = {
    getUser: () => of({} as User),
    updateUser: () => of({}),
  };

  const mockPhotoService = {
    loadPhoto: () => of(new Blob()),
    uploadImage: () => of({}),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageProfileComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: PhotoService, useValue: mockPhotoService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update user profile with empty inputs', () => {
    component.updateForm?.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      streetAndNumber: '',
      city: '',
      postalCode: '',
      country: '',
    });

    spyOn(component, 'validate').and.returnValue(false);
    spyOn(component.userService, 'updateUser');

    component.updateUser();

    expect(component.validate).toHaveBeenCalled();
    expect(component.userService.updateUser).not.toHaveBeenCalled();
  });

  it('should update user profile', () => {
    spyOn(component, 'validate').and.returnValue(true);
    spyOn(component.userService, 'updateUser').and.returnValue(of({}));

    component.updateUser();

    expect(component.userService.updateUser).toHaveBeenCalledWith(123, component.updatedUser);
  });

  it('should handle file input change', () => {
    const event = {
      target: {
        files: [new Blob()],
      },
    } as any;

    spyOn(URL, 'createObjectURL').and.returnValue('fakeImageUrl');
    spyOn(component, 'convertBlobToFile').and.returnValue(Promise.resolve(new File([], 'fakeImage.png')));

    component.fileInput.nativeElement.dispatchEvent(new Event('change', event));

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(component.displayedImageUrl).toEqual('fakeImageUrl');
  });
  
  it('should delete user for guest', () => {
    spyOn(Swal, 'fire');
    spyOn(component.guestService, 'deleteGuest').and.returnValue(of(void));

    component.loggedUser = { id: 123, role: Role.Guest} as User;
    component.deleteUser();

    expect(component.guestService.deleteGuest).toHaveBeenCalledWith(123);
    expect(Swal.fire).toHaveBeenCalledWith('Deleted!', 'Your account has been deleted.', 'success');
    //expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should handle error while deleting user for guest', () => {
    spyOn(Swal, 'fire');
    spyOn(component.guestService, 'deleteGuest').and.returnValue(throwError('Error deleting user'));

    component.loggedUser = { id: 123, role: Role.Guest } as User;
    component.deleteUser();

    expect(component.guestService.deleteGuest).toHaveBeenCalledWith(123);
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'An error occurred while deleting your account.', 'error');
  });

  it('should delete user for host', () => {
    spyOn(Swal, 'fire');
    spyOn(component.hostService, 'deleteHost').and.returnValue(of(void));

    component.loggedUser = { id: 123, role: Role.Host } as User;
    component.deleteUser();

    expect(component.hostService.deleteHost).toHaveBeenCalledWith(123);
    expect(Swal.fire).toHaveBeenCalledWith('Deleted!', 'Your account has been deleted.', 'success');
    //expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should handle error while deleting user for host', () => {
    spyOn(Swal, 'fire');
    spyOn(component.hostService, 'deleteHost').and.returnValue(throwError('Error deleting user'));

    component.loggedUser = { id: 123, role: Role.Host } as User;
    component.deleteUser();

    expect(component.hostService.deleteHost).toHaveBeenCalledWith(123);
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'An error occurred while deleting your account.', 'error');
  });
});
