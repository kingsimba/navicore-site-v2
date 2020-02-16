import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private router: Router) {

    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
    }

    isStandaloneDocument() {
        return this.router.url.endsWith('.html') || this.router.url.endsWith('htm');
    }
}
