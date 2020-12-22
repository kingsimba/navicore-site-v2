import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedLinkComponent } from './protected-link.component';

describe('ProtectedLinkComponent', () => {
  let component: ProtectedLinkComponent;
  let fixture: ComponentFixture<ProtectedLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtectedLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
