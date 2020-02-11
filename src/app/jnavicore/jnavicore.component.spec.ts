/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JnavicoreComponent } from './jnavicore.component';

describe('JnavicoreComponent', () => {
  let component: JnavicoreComponent;
  let fixture: ComponentFixture<JnavicoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnavicoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnavicoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
