// map.component.ts

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.initializeMap(-15.800513, -47.91378);
  }

  private initializeMap(latitude: number, longitude: number): void {
    const mymap = L.map('map', {
      attributionControl: false,
    }).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mymap);

    L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: 'pin-icon',
        html: '<i class="fas fa-map-pin"></i>', 
      }),
    }).addTo(mymap);

    const mapContainer = mymap.getContainer();
    mapContainer.style.filter = 'grayscale(80%) invert(80%)';

  }
}
