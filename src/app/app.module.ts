import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

// flex-layout module
import { FlexLayoutModule } from '@angular/flex-layout';

// ant design modules
import { NZ_ICONS, NZ_I18N, en_US } from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';

// material design modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';

import {
    MenuFoldOutline,
    MenuUnfoldOutline,
    FormOutline,
    DashboardOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone,
} from '@ant-design/icons-angular/icons';

const ICONS = [
    MenuFoldOutline,
    MenuUnfoldOutline,
    DashboardOutline,
    FormOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone];

import { HomePageComponent } from './home-page/home-page.component';
import { NavizeroComponent } from './navizero/navizero.component';
import { SdkComponent } from './sdk/sdk.component';
import { OpenSourceComponent } from './open-source/open-source.component';
import { IteComponent } from './ite/ite.component';
import { ApiComponent } from './api/api.component';
import { ExternalLinkDirective } from './external-link.directive';
import { LegalNoticeComponent } from './navizero/legal-notice/legal-notice.component';
import { PrivacyComponent } from './navizero/privacy/privacy.component';
import { ServiceTermsComponent } from './navizero/service-terms/service-terms.component';
import { TitleBarComponent } from './title-bar/title-bar.component';

registerLocaleData(en);

const ROUTES: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'sdk', component: SdkComponent },
    { path: 'navizero', component: NavizeroComponent },
    { path: 'api', component: ApiComponent },
    { path: 'ite', component: IteComponent },
    { path: 'open-source', component: OpenSourceComponent },
    { path: 'navizero/legal-notice', component: LegalNoticeComponent },
    { path: 'navizero/legal-notice.html', component: LegalNoticeComponent },
    { path: 'navizero/privacy', component: PrivacyComponent },
    { path: 'navizero/NaviZeroPrivatePolicy.htm', component: PrivacyComponent },
    { path: 'navizero/service-terms', component: ServiceTermsComponent },
    { path: 'navizero/NaviZeroServiceTerms.htm', component: ServiceTermsComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        NavizeroComponent,
        SdkComponent,
        OpenSourceComponent,
        IteComponent,
        ApiComponent,
        ExternalLinkDirective,
        LegalNoticeComponent,
        PrivacyComponent,
        ServiceTermsComponent,
        TitleBarComponent
    ],
    imports: [
        BrowserModule,
        NzButtonModule,
        NzLayoutModule,
        NzCardModule,
        NzTagModule,
        NzIconModule,
        NzModalModule,
        NzInputModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatRippleModule,
        FlexLayoutModule,
        RouterModule.forRoot(ROUTES,
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload'
            }
        )
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
        { provide: NZ_ICONS, useValue: ICONS }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
