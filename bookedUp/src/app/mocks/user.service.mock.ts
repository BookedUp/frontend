import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user/model/user.model';
import { Role } from '../user/model/role.enum';

const mockUser1: User = { id: 1, firstName: 'Vesna', lastName: 'Vasic', email: 'vesna.vasic@example.com', phone: 123456790 };
const mockUser2: User = { id: 2, firstName: 'Ana', lastName: 'Poparic', email: 'ana.poparic@example.com', phone: 9876543210 };
const mockUser3: User = { id: 3, firstName: 'Dusica', lastName: 'Trbovic', email: 'dusica.trbovic@example.com', phone: 55555555 };

const mockUser4: User = {
  id: 4,
  firstName: 'Ime',
  lastName: 'Prezime',
  address: {
    country: 'Srbija',
    city: 'Novi Sad',
    postalCode: '21000',
    streetAndNumber: 'Bulevar Oslobodjenja 5',
    latitude: 0,
    longitude: 0,
  },
  phone: 642527738,
  email: 'test@example.com',
  password: 'sifra123',
  blocked: false,
  verified: false,
  active: true,
  profilePicture: {
    url: 'path/to/photo.jpg',
    active: true,
  },
  role: Role.Guest,
}

const mockUser5: User = {
  id: 5,
  firstName: 'Ime',
  lastName: 'Prezime',
  address: {
    country: 'Srbija',
    city: 'Novi Sad',
    postalCode: '21000',
    streetAndNumber: 'Bulevar Oslobodjenja 5',
    latitude: 0,
    longitude: 0,
  },
  phone: 642527738,
  email: 'test@example.com',
  password: 'sifra123',
  blocked: false,
  verified: false,
  active: true,
  profilePicture: {
    url: 'path/to/photo.jpg',
    active: true,
  },
  role: Role.Host,
}




const mockUsers: User[] = [mockUser1, mockUser2, mockUser3, mockUser4, mockUser5];


export { mockUser1, mockUser2, mockUser3, mockUser4, mockUser5, mockUsers };