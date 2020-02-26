import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    public loginStatusChanged: EventEmitter<any> = new EventEmitter<any>();

    loginSucceeded = false;
    username = '';
    nickname = '';

    private logoutSubs: Subscription;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        this.syncWithCookie();
    }

    login<T>(username: string, password: string): Observable<T> {
        const observable = new Observable<T>((observer) => {
            // post form data
            const params = new HttpParams()
                .set('username', username)
                .set('password', password);
            const loginSubs = this.http.post<any>('api/login', params).subscribe(
                {
                    next: value => {
                        console.log(value);
                        if (value.code === 0) {
                            this.loginSucceeded = true;
                            this.syncWithCookie();
                            observer.next(value);
                        } else {
                            this.syncWithCookie();
                            observer.error(value.msg);
                        }
                        this.loginStatusChanged.emit(null);
                    },
                    error: err => {
                        observer.error(err.errorMessage);
                        this.syncWithCookie();
                        this.loginStatusChanged.emit(null);
                    }
                }
            );

            return {
                unsubscribe() {
                    if (loginSubs) {
                        loginSubs.unsubscribe();
                    }
                }
            };
        });

        return observable;
    }

    logout(): void {
        // post form data
        if (this.logoutSubs != null) {
            this.logoutSubs.unsubscribe();
        }
        this.logoutSubs = this.http.get<any>('api/logout').subscribe(
            {
                next: value => {
                    console.log(value);
                    if (value.code === 0) {
                        this.performLogout();
                    }
                    this.logoutSubs = undefined;
                },
                error: err => {
                    if (err.status == 401) {
                        this.performLogout();
                    }
                    this.logoutSubs = undefined;
                }
            }
        );
    }

    performLogout(): void {
        if (this.loginSucceeded) {
            this.cookieService.delete('Name', '/')
            this.cookieService.delete('Token', '/');

            this.syncWithCookie();

            this.loginStatusChanged.emit(null);
        }
    }

    // if failed, return error message. Or else, return ''.
    performBasicLoginCheck(username: string, password: string): string {
        if (password.length < 1) {
            return "密码不能为空";
        }
        else if (username.length < 1) {
            return '用户名不能为空';
        }
        else if ((username.indexOf('@') !== -1) &&
            (!username.endsWith("@navinfo.com") && !username.endsWith('@mapbar.com'))) {
            return "用户名必须为 xxx@navinfo.com 或者 xxx@mapbar.com";
        }

        return '';
    }

    syncWithCookie() {
        this.username = this.cookieService.get('Name');
        this.nickname = this.username.split('@')[0];
        this.loginSucceeded = this.username !== '';
    }
}
