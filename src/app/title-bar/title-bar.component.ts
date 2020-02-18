import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-title-bar',
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

    loginMessage = '登录功能还未实现，不用试了';

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

    loginForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {
        this.loginForm = this.formBuilder.group({
            username: '',
            password: ''
        });
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
        this.innerWidth = window.innerWidth;
    }

    showLoginBox(): void {
        this.loginBoxVisible = true;
    }

    handleLoginOK(loginData): void {
        console.log('login clicked!');

        this.loginForm.disable();

        // post form data
        const params = new HttpParams({ fromObject: loginData });
        this.http.post<any>('http://dal.navicore.cn:9080', params).subscribe(
            {
                next: value => {
                    this.loginBoxVisible = false;
                    this.loginForm.enable();
                },
                error: err => {
                    console.log(err);
                    // reset password
                    this.loginForm.get('password').reset();
                    this.loginMessage = '登录错误: ' + err.message;
                    this.loginForm.enable();
                }
            }
        );
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
