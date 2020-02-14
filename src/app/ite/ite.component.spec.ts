import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IteComponent } from './ite.component';

describe('IteComponent', () => {
  let component: IteComponent;
  let fixture: ComponentFixture<IteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
