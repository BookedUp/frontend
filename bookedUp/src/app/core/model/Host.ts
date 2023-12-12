import { User } from './User';
import { Address } from './Address';
import { Photo } from './Photo';

export interface Host extends User {
  averageRating: number;
  reservationCreatedNotificationEnabled: boolean;
  cancellationNotificationEnabled: boolean;
  hostRatingNotificationEnabled: boolean;
  accommodationRatingNotificationEnabled: boolean;
}
