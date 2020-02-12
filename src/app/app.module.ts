import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { FootbarComponent } from './footbar/footbar.component';
import { ServicesComponent } from './services/services.component';
import { InavicoreComponent } from './inavicore/inavicore.component';
import { JnavicoreComponent } from './jnavicore/jnavicore.component';
import { OpenSourceComponent } from './open-source/open-source.component';
import { NavizeroComponent } from './navizero/navizero.component';
import { FormsModule } from '@angular/forms';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      FootbarComponent,
      ServicesComponent,
      InavicoreComponent,
      JnavicoreComponent,
      OpenSourceComponent,
      NavizeroComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatIconModule,
      MatToolbarModule,
      FormsModule,
      RouterModule.forRoot([
        { path: '', component: HomeComponent },
        { path: 'inavicore', component: InavicoreComponent },
        { path: 'jnavicore', component: JnavicoreComponent },
        { path: 'navizero', component: NavizeroComponent },
        { path: 'open-source', component: OpenSourceComponent },
        { path: 'services', component: ServicesComponent }
      ])
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
