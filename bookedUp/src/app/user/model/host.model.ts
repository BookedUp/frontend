import { User } from './user.model';
import { Address } from '../../shared/model/address.model';
import { Photo } from '../../shared/model/photo.model';

export interface Host extends User {
  averageRating?: number;
  reservationCreatedNotificationEnabled?: boolean;
  cancellationNotificationEnabled?: boolean;
  hostRatingNotificationEnabled?: boolean;
  accommodationRatingNotificationEnabled?: boolean;
}
