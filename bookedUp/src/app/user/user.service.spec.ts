import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './model/user.model';

describe('UserService', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should retrieve users from the API', () => {
    const mockUsers: User[] = [
      { id: 1, firstName: 'Vesna', lastName: 'Vasic', email: 'vesna.vasic@example.com', phone: 123456790 },
      { id: 2, firstName: 'Ana', lastName: 'Poparic', email: 'ana.poparic@example.com', phone: 9876543210 },
      { id: 3, firstName: 'Dusica', lastName: 'Trbovic', email: 'dusica.trbovic@example.com', phone: 55555555 },
    ];

    userService.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });



  it('should handle errors', () => {
    const mockError = { status: 404, statusText: 'Not Found' };

    userService.getUsers().subscribe(
        () => fail('expected an error, not users'),
        (error) => {
          expect(error.status).toEqual(404);
          expect(error.statusText).toEqual('Not Found');
        }
    );

    const req = httpTestingController.expectOne('http://localhost:8080/api/users');
    req.error(new ErrorEvent('Not Found'), mockError);
  });

  // Dodaj slične testove za druge metode u UserService
  // ...

  it('should create a new user via API', () => {
    const mockUser: User = {
      id: 3,
      firstName: 'New',
      lastName: 'User',
      email: 'new.user@example.com',
      phone: 1234567890,
    };

    userService.createUser(mockUser).subscribe((createdUser) => {
      expect(createdUser).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser);
  });

  it('should update an existing user via API', () => {
    const mockUser: User = {
      id: 3,
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated.user@example.com',
      phone: 9876543210,
    };

    userService.updateUser(3, mockUser).subscribe((updatedUser) => {
      expect(updatedUser).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/users/3');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockUser);
  });

  it('should delete an existing user via API', () => {
    const userId = 3;

    userService.deleteUser(userId).subscribe(() => {
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/api/users/${userId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
