import { Address } from './Address';
import { Photo } from './Photo';

export interface User{
  id: number;
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  password: string;
  isBlocked: boolean;
  verified: boolean;
  active: boolean;
  profilePicture: Photo;
}
