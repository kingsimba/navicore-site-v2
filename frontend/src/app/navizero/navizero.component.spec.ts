import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaviZeroComponent } from './navizero.component';

describe('NaviZeroComponent', () => {
  let component: NaviZeroComponent;
  let fixture: ComponentFixture<NaviZeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaviZeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
