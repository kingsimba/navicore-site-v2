import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';

import { NZ_ICONS } from 'ng-zorro-antd';

import {
    MenuFoldOutline,
    MenuUnfoldOutline,
    FormOutline,
    DashboardOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone
} from '@ant-design/icons-angular/icons';

const ICONS = [
    MenuFoldOutline,
    MenuUnfoldOutline,
    DashboardOutline,
    FormOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone];

import { ImageCardComponent } from './image-card/image-card.component';
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
    { path: 'navizero/NaviZeroServiceTerms.htm', component: PrivacyComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        ImageCardComponent,
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
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule,
        MatRippleModule,
        NzIconModule,
        FlexLayoutModule,
        RouterModule.forRoot(ROUTES,
            {
                scrollPositionRestoration: 'enabled'
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
