import { Address } from './Address';
import { Amenity } from './Amenity';
import { Photo } from './Photo';
import { AccommodationType } from './enum/AccommodationType';
import { DateRange } from './DateRange';
import { PriceType } from './enum/PriceType';
import { PriceChange } from './PriceChange';
import { Host } from './Host';
import { AccommodationStatus } from './enum/AccommodationStatus';

export interface Accommodation {
  id: number;
  name: string;
  description: string;
  address: Address;
  amenities: Amenity[];
  photos: Photo[];
  minGuests: number;
  maxGuests: number;
  type: AccommodationType;
  availability: DateRange[];
  priceType: PriceType;
  priceChanges: PriceChange[];
  automaticReservationAcceptance: boolean;
  status: AccommodationStatus;
  host: Host;
  price: number;
  totalPrice: number;
  averageRating: number;
  cancellationDeadline: number;
}
