import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUnloggedComponent } from './header-unlogged.component';

describe('HeaderUnloggedComponent', () => {
  let component: HeaderUnloggedComponent;
  let fixture: ComponentFixture<HeaderUnloggedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderUnloggedComponent]
    });
    fixture = TestBed.createComponent(HeaderUnloggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
