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

registerLocaleData(en);

const ROUTES: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'navizero', component: NavizeroComponent },
    { path: 'sdk', component: SdkComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        ImageCardComponent,
        NavizeroComponent,
        SdkComponent
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
        RouterModule.forRoot(ROUTES)
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
        { provide: NZ_ICONS, useValue: ICONS }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
