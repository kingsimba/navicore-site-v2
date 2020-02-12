import { Component, OnInit } from '@angular/core';
import { Template } from '@angular/compiler/src/render3/r3_ast';

class People {
  constructor(public name: string, public age: number) {}
}

@Component({
  selector: 'app-navizero',
  templateUrl: './navizero.component.html',
  styleUrls: ['./navizero.component.css'],
})
export class NavizeroComponent implements OnInit {
  counter = 1;
  phoneNumber;

  constructor() { }

  staffs = [
    new People('Mike', 22),
    new People('John', 16)
  ];
  ngOnInit() {
  }

  increamentCounter() {
    this.counter++;
  }

  updatePhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
}
