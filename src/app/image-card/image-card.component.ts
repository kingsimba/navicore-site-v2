import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent implements OnInit {
  @Input() title = 'Europe Street beat';
  @Input() description = 'navicore.mapbar.com';
  @Input() image = 'assets/navizero_icon.png';

  constructor() { }

  ngOnInit() {
  }

}
