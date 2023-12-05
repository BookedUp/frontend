import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMainPageComponent } from './owner-main-page.component';

describe('OwnerMainPageComponent', () => {
  let component: OwnerMainPageComponent;
  let fixture: ComponentFixture<OwnerMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerMainPageComponent]
    });
    fixture = TestBed.createComponent(OwnerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
