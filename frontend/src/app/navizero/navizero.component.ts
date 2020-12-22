import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-navizero',
    templateUrl: './navizero.component.html',
    styleUrls: ['./navizero.component.scss']
})
export class NaviZeroComponent implements OnInit {

    images = [
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/0df0ae43179a84dfa3ab136c07c20a2b857402ec9',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/09e2344073ded851e79686b2201ed71a876414c92',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/04cca04f952c842a40bad9d72b3aa651c1f23ce33',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/06a44436a66bd95312234a9d5df6144f0ff40c5cc',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/09f0a4531a978bdf49ab1d6c0322002e8e743c7ae',
    ];

    downloads = [
        {
            title: '苹果AppStore',
            link: 'https://apps.apple.com/cn/app/%E5%AF%BC%E8%88%AA%E9%9B%B6%E5%8F%B7/id1469022033'
        },
        {
            title: '华为应用市场',
            link: 'https://appstore.huawei.com/app/C101191423'
        },
        {
            title: '小米应用商店',
            link: 'http://app.mi.com/details?id=com.mapbar.navigation.zero.release'
        },
        {
            title: '安卓内测版(密码 mapbar)',
            link: 'https://www.pgyer.com/eGby'
        },
        {
            title: 'iOS内测版(密码 mapbar)',
            link: 'https://www.pgyer.com/xJXq'
        }
    ];

    references = [
        {
            title: '产品隐私政策',
            link: '/navizero/privacy'
        },
        {
            title: '产品服务条款',
            link: '/navizero/service-terms'
        },
        {
            title: '版权和致谢',
            link: '/navizero/legal-notice'
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}

