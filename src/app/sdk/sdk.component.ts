import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sdk',
  templateUrl: './sdk.component.html',
  styleUrls: ['./sdk.component.scss']
})
export class SdkComponent implements OnInit {

    downloads = [
        {
            title: 'iOS SDK',
            link: 'http://navicore.mapbar.com/ncgit/iNaviCore.framework.zip'
        },
        {
            title: 'Android SDK',
            link: 'http://navicore.mapbar.com/ncgit/jNaviCore.zip'
        }
    ];

    codesRepos = [
        {
            title: 'iNaviCore SDK仓库 (for iOS)',
            link: 'https://gitlab.mapbar.com/navicore/iNaviCore'
        },
        {
            title: 'jNaviCore SDK仓库 (for Android)',
            link: 'https://gitlab.mapbar.com/navicore/jNaviCore'
        }
    ];

  constructor() { }

  ngOnInit() {
  }

}
