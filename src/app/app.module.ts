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
    MenuOutline,
    FormOutline,
    DashboardOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone,
} from '@ant-design/icons-angular/icons';

const ICONS = [
    MenuOutline,
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
import { HtmlPageComponent } from './navizero/html-page/html-page.component';
import { TitleBarComponent } from './title-bar/title-bar.component';

registerLocaleData(en);

const ROUTES: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'sdk', component: SdkComponent },
    { path: 'navizero', component: NavizeroComponent },
    { path: 'api', component: ApiComponent },
    { path: 'ite', component: IteComponent },
    { path: 'open-source', component: OpenSourceComponent },
    { path: 'navizero/:doc', component: HtmlPageComponent },
    { path: 'license/:doc', component: HtmlPageComponent },	// backward compatible with legacy pages: /license/NC_MIT_0.1
    { path: 'inavicore', component: SdkComponent },			// backward compatible with legacy page
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
        HtmlPageComponent,
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
