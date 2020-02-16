import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
    selector: 'app-title-bar',
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

    isCollapsed = false;

    menuItems = [
        { title: '导航零号', link: 'navizero' },
        { title: '导航SDK', link: 'sdk' },
        { title: 'API', link: 'api' },
        { title: 'ITE', link: 'ite' },
        { title: '开源项目', link: 'open-source' }
    ];

    loginBoxVisible = false;

    private innerWidth: any;

    constructor() { }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
        this.innerWidth = window.innerWidth;
    }

    showLoginBox(): void {
        this.loginBoxVisible = true;
    }

    handleLoginOK(): void {
        console.log('Button ok clicked!');
        this.loginBoxVisible = false;
    }

    handleLoginCancel(): void {
        console.log('Button cancel clicked!');
        this.loginBoxVisible = false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    isDesktop() {
        return this.innerWidth >= 768;
    }
}
