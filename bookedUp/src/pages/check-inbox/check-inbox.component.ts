import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-inbox',
  templateUrl: './check-inbox.component.html',
  styleUrls: ['./check-inbox.component.css']
})
export class CheckInboxComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    var frameContainer = document.getElementById("frameContainer");
    if (frameContainer) {
      frameContainer.addEventListener("click", () => {
        this.router.navigate(['/login']);
      });
    }

  }
}
