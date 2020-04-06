import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-ite',
  templateUrl: './ite.component.html',
  styleUrls: ['./ite.component.css']
})
export class IteComponent implements OnInit {

  constructor(public loginService: LoginService) { }

  ngOnInit() {
  }
}
