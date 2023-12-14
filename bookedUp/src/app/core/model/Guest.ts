import { Accommodation } from "./Accommodation";
import { User } from "./User";

export interface Guest extends User{
    favourites: Accommodation[];
    notificationEnable: boolean;
}