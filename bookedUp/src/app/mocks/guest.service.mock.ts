import { Guest } from "../user/model/guest.model";
import { Role } from "../user/model/role.enum";

export const mockGuest: Guest = {
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
    role: Role.Host,
    favourites: [],
    notificationEnable: true,
};