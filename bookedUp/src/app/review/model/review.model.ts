import { Host } from "src/app/user/model/host.model";
import { ReviewType } from "./enum/reviewType.enum";
import { Accommodation } from "src/app/accommodation/model/accommodation.model";
import {Guest} from "../../user/model/guest.model";

export interface Review {
    id: number;
    review: number;
    comment: string;
    date: Date;
    host: Host;
    guest: Guest;
    accommodation: Accommodation;
    type: ReviewType;
  }
