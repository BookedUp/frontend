import { Accommodation } from "../accommodation/model/accommodation.model";
import { AccommodationStatus } from "../accommodation/model/enum/accommodationStatus.enum";
import { AccommodationType } from "../accommodation/model/enum/accommodationType.enum";
import { Amenity } from "../accommodation/model/enum/amenity.enum";
import { PriceType } from "../accommodation/model/enum/priceType.enum";
import { Role } from "../user/model/role.enum";

export const mockAccommodation: Accommodation = {
    id: 1,
    name: 'Mock Accommodation',
    description: 'This is a mock accommodation for testing purposes.',
    address: {
        country: 'Srbija',
        city: 'Novi Sad',
        postalCode: '21000',
        streetAndNumber: 'Bulevar Oslobodjenja 5',
        latitude: 0,
        longitude: 0,
    },
    amenities: [
        Amenity.FreeWifi,
        Amenity.FitnessCentre
    ],
    photos: [
      { id: 1, url: 'mock-photo1.jpg' },
      { id: 2, url: 'mock-photo2.jpg' },
    ],
    minGuests: 2,
    maxGuests: 4,
    type: AccommodationType.Apartment,
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-10') },
      { startDate: new Date('2024-02-01'), endDate: new Date('2024-02-10') },
    ],
    priceType: PriceType.PerNight,
    priceChanges: [
      { id: 1, changeDate: new Date('2024-01-01'), newPrice: 100 },
      { id: 2, changeDate: new Date('2024-01-06'), newPrice: 120 },
    ],
    automaticReservationAcceptance: true,
    status: AccommodationStatus.Active,
    host: {
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
        averageRating: 4.3,
        reservationCreatedNotificationEnabled: true,
        cancellationNotificationEnabled: true,
        hostRatingNotificationEnabled: true,
        accommodationRatingNotificationEnabled: true,
    },
    price: 100,
    totalPrice: 200,
    averageRating: 4.5,
    cancellationDeadline: 7
  };