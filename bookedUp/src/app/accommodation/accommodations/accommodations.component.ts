import { Component, Input, OnInit } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Accommodation } from '../model/accommodation.model';
import { Observable } from 'rxjs';
import {AuthService} from "../../infrastructure/auth/auth.service";
@Component({
    selector: 'app-accommodations',
    templateUrl: './accommodations.component.html',
    styleUrls: ['./accommodations.component.css', '../../../styles.css']
})
export class AccommodationsComponent implements OnInit {

    accommodations: Observable<Accommodation[]> = new Observable<Accommodation[]>();
    selectedClass: string = 'active-accommodations';
    filter: string = 'active';

    priceTypeGuest: string = 'per guest';
    priceTypeNight: string = 'per night';
    constructor(private accommodationService: AccommodationService, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.filter = params['filter'] || 'active';
            this.loadAccommodations();
        });
        //this.accommodations = this.accommodationService.getAllActiveAccommodationsByHostId(this.authService.getUserID());

    }

    private loadAccommodations(): void {
        if (this.filter === 'active') {
            this.accommodations = this.accommodationService.getAllActiveAccommodationsByHostId(this.authService.getUserID());
        } else if (this.filter === 'requests') {
            this.accommodations = this.accommodationService.getAllRequestsByHostId(this.authService.getUserID());
        } else {
            this.accommodations = this.accommodationService.getAllRejectedByHostId(this.authService.getUserID());

        }
    }

    changeStyle(className: string): void {
        this.selectedClass = className;
        if (className === 'active-accommodations') {
            this.router.navigate(['/my-accommodations'], { queryParams: { filter: 'active' } });
        } else if (className === 'requests-accommodations') {
            this.router.navigate(['/my-accommodations'], { queryParams: { filter: 'requests' } });
        } else {
            this.router.navigate(['/my-accommodations'], { queryParams: { filter: 'rejected' } });
        }
    }


    generateStars(rating: number): string[] {
        const stars: string[] = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('★');
            } else if (i - 0.5 === rating) {
                stars.push('✯');
            } else {
                stars.push('☆');
            }
        }
        return stars;
    }

    roundHalf(value: number): number {
        return Math.round(value * 2) / 2;
    }

    getRequestsAccommodations() {
        this.accommodations = this.accommodationService.getAllRequestsByHostId(this.authService.getUserID());
    }

    getActiveAccommodations() {
        this.accommodations = this.accommodationService.getAllActiveAccommodationsByHostId(this.authService.getUserID());
    }

    getRejectedAccommodations() {
        this.accommodations = this.accommodationService.getAllRejectedByHostId(this.authService.getUserID());

    }
}
