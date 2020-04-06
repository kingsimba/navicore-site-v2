import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavizeroComponent } from './navizero.component';

describe('NavizeroComponent', () => {
  let component: NavizeroComponent;
  let fixture: ComponentFixture<NavizeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavizeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavizeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
