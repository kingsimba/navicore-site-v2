import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'navicore-site';
  pages = [
    { title: 'NaviZero', url: 'navizero' },
    { title: 'iNaviCore', url: 'inavicore' },
    { title: 'jNaviCore', url: 'jnavicore' },
    { title: 'Services', url: 'services' },
    { title: 'Open Source', url: 'open-source' }
  ];
}
