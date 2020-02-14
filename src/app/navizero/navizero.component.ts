import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navizero',
    templateUrl: './navizero.component.html',
    styleUrls: ['./navizero.component.scss']
})
export class NavizeroComponent implements OnInit {

    references: [
        {
            title: '产品隐私政策',
            link: 'https://gitlab.mapbar.com/navicore/navi-zero-ios'
        },
        {
            title: '产品服务条款',
            link: 'http://www.navicore.cn/navizero/NaviZeroServiceTerms.htm'
        },
        {
            title: '版权和致谢',
            link: 'http://www.navicore.cn/navizero/legal-notice.html'
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
