import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-navizero',
    templateUrl: './navizero.component.html',
    styleUrls: ['./navizero.component.scss']
})
export class NavizeroComponent implements OnInit {

    images = [
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/01badf49f62874d2914cbeea8efc1c7eb3977f9e2',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/04a92659fd343469a0f1069e7aa22d69fb03845e3',
        'http://file.market.xiaomi.com/thumbnail/jpeg/l395/AppStore/0ab3f64178cf143690f7f881c81016e677375c5ca'
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

    constructor(public loginService: LoginService) { }

    ngOnInit() {
    }

}

