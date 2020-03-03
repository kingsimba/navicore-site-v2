import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-title-bar',
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit, OnDestroy {
    @ViewChild('loginBox', { static: false }) loginBox: NzModalRef;
    @ViewChild('passwordInput', { static: false }) passwordInput: ElementRef;

    loginMessage = '';
    passwordVisible = false;
    isCollapsed = false;
    userNameOptions: string[];

    menuItems = [
        { title: '导航零号', link: 'navizero' },
        { title: '导航SDK', link: 'sdk' },
        { title: 'API', link: 'api' },
        { title: 'ITE', link: 'ite' },
        { title: '开源项目', link: 'open-source' },
        { title: '文档', link: 'docs' }
    ];

    loginBoxVisible = false;

    private innerWidth: any;

    loginForm: FormGroup;

    loginRequest: Subscription;

    constructor(private formBuilder: FormBuilder, public loginService: LoginService) {
        this.loginForm = this.formBuilder.group({
            username: '',
            password: ''
        });
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
        this.innerWidth = window.innerWidth;
    }

    ngOnDestroy() {
        this.unsubscribeLogin();
    }

    showLoginBox(): void {
        this.passwordVisible = false;
        this.loginBoxVisible = true;
    }

    private unsubscribeLogin() {
        if (this.loginRequest) {
            this.loginRequest.unsubscribe();
        }
    }

    handleLoginOK(loginData): void {
        console.log('login clicked!');

        this.loginMessage = this.loginService.performBasicLoginCheck(loginData.username, loginData.password);
        if (this.loginMessage !== '') {
            return;
        }

        this.loginForm.disable();
        this.unsubscribeLogin();
        this.loginRequest = this.loginService.login<any>(loginData.username, loginData.password).subscribe({
            next: value => {
                this.loginForm.enable();
                this.loginBoxVisible = false;
                this.loginRequest = undefined;
            },
            error: err => {
                console.log(err);
                setTimeout(() => { // this will make the execution after the above boolean has changed
                    this.passwordInput.nativeElement.focus();
                    this.passwordInput.nativeElement.select();
                }, 0);
                this.loginMessage = '登录错误: ' + err;
                this.loginForm.enable();
                this.loginRequest = undefined;
            }
        });
    }

    handleLoginCancel(): void {
        console.log('Button cancel clicked!');
        this.unsubscribeLogin();
        this.loginBoxVisible = false;
    }

    clearLoginMessage() {
        this.loginMessage = '';
    }

    addUserNamePostFix(e: Event): void {
        const name = (e.target as HTMLInputElement).value;

        // split name into user + domain
        let user = '';
        let domain = '';
        const atSymbolIndex = name.indexOf('@');
        if (name != null && atSymbolIndex !== -1) {
            user = name.substring(0, atSymbolIndex);
            domain = name.substring(atSymbolIndex);
        } else {
            user = name;
        }

        const options = domain !== '' ?  [] : [name];

        if (domain != null) {
            const domains = ['@navinfo.com', '@mapbar.com'];
            for (const d of domains) {
                if (d.startsWith(domain)) {
                    options.push(user + d);
                }
            }
        }

        this.userNameOptions = options;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    isDesktop() {
        return this.innerWidth >= 768;
    }
}
