import { Host } from "@angular/core";
import { ReviewType } from "./enum/reviewType.enum";
import { Accommodation } from "src/app/accommodation/model/accommodation.model";

export interface Review {
    id: number;
    review: number;
    comment: string;
    date: Date;
    host: Host;
    accommodation: Accommodation;
    type: ReviewType;
  }