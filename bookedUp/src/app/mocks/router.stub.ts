import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RouterStub {
  routerState = { root: '' };
  navigate() {
    return;
  }
}
