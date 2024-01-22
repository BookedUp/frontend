import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserServiceMock {
  private mockUsers: User[] = [
    { id: 1, firstName: 'Vesna', lastName: 'Vasic', email: 'vesna.vasic@example.com', phone: 123456790 },
    { id: 2, firstName: 'Ana', lastName: 'Poparic', email: 'ana.poparic@example.com', phone: 9876543210 },
    { id: 3, firstName: 'Dusica', lastName: 'Trbovic', email: 'dusica.trbovic@example.com', phone: 55555555 },
  ];

  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  createUser(user: User): Observable<User> {
    const newUser = { ...user, id: this.mockUsers.length + 1 };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  updateUser(userId: number, updatedUser: User): Observable<User> {
    const index = this.mockUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.mockUsers[index] = updatedUser;
      return of(updatedUser);
    } else {
      return of(updatedUser);
    }
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.mockUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
    }
    return of(undefined);
  }
}
