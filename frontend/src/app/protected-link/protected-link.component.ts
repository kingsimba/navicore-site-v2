import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-protected-link',
  templateUrl: './protected-link.component.html',
  styleUrls: ['./protected-link.component.css']
})
export class ProtectedLinkComponent implements OnInit {
  @Input() href: string;

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }

  alert() {
    window.alert('请先登录');
  }
}
