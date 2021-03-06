import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzListModule } from 'ng-zorro-antd/list';

// material design modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { LightboxModule } from 'ngx-lightbox';

import {
    MenuOutline,
    FormOutline,
    DashboardOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone,
    DownOutline,
    UserOutline,
    EyeInvisibleOutline,
    MenuFoldOutline,
    MenuUnfoldOutline,
    HomeOutline,
    CopyTwoTone,
    LeftCircleOutline,
    RightCircleOutline,
} from '@ant-design/icons-angular/icons';

const ICONS = [
    MenuOutline,
    DashboardOutline,
    FormOutline,
    GithubOutline,
    ToolTwoTone,
    ApiTwoTone,
    DownOutline,
    UserOutline,
    EyeInvisibleOutline,
    MenuFoldOutline,
    MenuUnfoldOutline,
    HomeOutline,
    CopyTwoTone,
    LeftCircleOutline,
    RightCircleOutline,
];

import { HomePageComponent } from './home-page/home-page.component';
import { NaviZeroComponent } from './navizero/navizero.component';
import { SdkComponent } from './sdk/sdk.component';
import { OpenSourceComponent } from './open-source/open-source.component';
import { IteComponent } from './ite/ite.component';
import { ApiComponent } from './api/api.component';
import { ExternalLinkDirective } from './external-link.directive';
import { HtmlPageComponent } from './navizero/html-page/html-page.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { DocsComponent } from './docs/docs.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { ProtectedLinkComponent } from './protected-link/protected-link.component';

registerLocaleData(en);

const ROUTES: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'sdk', component: SdkComponent },
    { path: 'navizero', component: NaviZeroComponent },
    { path: 'api', component: ApiComponent },
    { path: 'ite', component: IteComponent },
    { path: 'open-source', component: OpenSourceComponent },
    {
        path: 'docs', children: [
            {path: '', component: DocListComponent},
            {path: '**', component: DocsComponent},
        ]
    },
    { path: 'navizero/:doc', component: HtmlPageComponent },
    { path: 'license/:doc', component: HtmlPageComponent },	// backward compatible with legacy pages: /license/NC_MIT_0.1
    { path: 'inavicore', component: SdkComponent },			// backward compatible with legacy page
    { path: 'jnavicore', component: SdkComponent },			// backward compatible with legacy page
];

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        NaviZeroComponent,
        SdkComponent,
        OpenSourceComponent,
        IteComponent,
        ApiComponent,
        ExternalLinkDirective,
        HtmlPageComponent,
        TitleBarComponent,
        DocsComponent,
        DocListComponent,
        ProtectedLinkComponent
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
        NzProgressModule,
        NzAutocompleteModule,
        NzListModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressBarModule,
        MatTooltipModule,
        FlexLayoutModule,
        LightboxModule,
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
        { provide: NZ_ICONS, useValue: ICONS },
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
