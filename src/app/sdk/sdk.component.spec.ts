import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkComponent } from './sdk.component';

describe('SdkComponent', () => {
  let component: SdkComponent;
  let fixture: ComponentFixture<SdkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
