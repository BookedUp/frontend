import { Host } from "src/app/user/model/host.model";
import { ReviewType } from "./enum/reviewType.enum";
import { Accommodation } from "src/app/accommodation/model/accommodation.model";

export interface Review {
    id: number;
    review: number;
    comment: string;
    date: Date;
    hostDTO: Host;
    accommodationDTO: Accommodation;
    type: ReviewType;
  }