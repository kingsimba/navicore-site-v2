/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InavicoreComponent } from './inavicore.component';

describe('InavicoreComponent', () => {
  let component: InavicoreComponent;
  let fixture: ComponentFixture<InavicoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InavicoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InavicoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
