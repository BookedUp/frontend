import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockUser4, mockUser5 } from 'src/app/mocks/user.service.mock';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should handle registration failure - Email already exists', () => {

    service.register(mockUser4).subscribe(
        () => {
            fail('Expected error, but got success');
        },
        (error) => {
            expect(error.status).toEqual(400);
            expect(error.error).toEqual('Email already exists');
        }
    );

    const req = httpTestingController.expectOne(`http://localhost:8080/api/registration`);
    expect(req.request.method).toEqual('POST');

    req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
  });

  it('should successfully register a user - Positive Case', () => {

    service.register(mockUser4).subscribe((registeredUser) => {
        expect(registeredUser).toEqual(mockUser4);
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/api/registration`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser4);
  });

});

//ng test --include="**/auth.service.spec.ts"