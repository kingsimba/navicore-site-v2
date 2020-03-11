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
        return (this.router.url.startsWith('/navizero') || this.router.url.startsWith('/license'))
            && (this.router.url.endsWith('.html') || this.router.url.endsWith('htm'));
    }

    needsFooter(): boolean {
        if (this.isStandaloneDocument()) {
            return false;
        }
        return !this.router.url.startsWith('/docs/');
    }
}
