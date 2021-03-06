import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpParameterCodec } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// A Custom encoder is used because the default one has bug by replacing + with space
// https://github.com/angular/angular/issues/18261
// https://github.com/angular/angular/issues/11058
class CustomQueryEncoderHelper implements HttpParameterCodec {
    encodeKey(k: string): string {
        return encodeURIComponent(k);
    }

    encodeValue(v: string): string {
        return encodeURIComponent(v);
    }

    decodeKey(k: string): string {
        return decodeURIComponent(k);
    }

    decodeValue(v: string): string {
        return decodeURIComponent(v);
    }
}

export const LOGIN_NAME = 'navicore_site_username';
export const LOGIN_TOKEN = 'navicore_site_token';
export const LOGIN_DISPLAY_NAME = 'navicore_site_displayName';

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
            const postBody = { username, password };
            const loginSubs = this.http.post<any>('api/v1/auth/login', postBody).subscribe(
                {
                    next: value => {
                        console.log(value);
                        if (value.status === 200) {
                            this.syncWithCookie();
                            observer.next(value);
                        } else {
                            this.syncWithCookie();
                            observer.error(value.msg);
                        }
                        this.loginStatusChanged.emit(null);
                    },
                    error: err => {
                        observer.error(err.error.message);
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
        if (this.logoutSubs != null) {
            this.logoutSubs.unsubscribe();
        }
        this.logoutSubs = this.http.post<any>('api/v1/auth/logout', '').subscribe(
            {
                next: value => {
                    console.log(value);
                    if (value.status === 200) {
                        this.performLogout();
                    }
                    this.logoutSubs = undefined;
                },
                error: err => {
                    if (err.status === 401) {
                        this.performLogout();
                    }
                    this.logoutSubs = undefined;
                }
            }
        );
    }

    performLogout(): void {
        if (this.loginSucceeded) {
            this.cookieService.delete(LOGIN_TOKEN, '/');

            this.syncWithCookie();

            this.loginStatusChanged.emit(null);
        }
    }

    // if failed, return error message. Or else, return ''.
    performBasicLoginCheck(username: string, password: string): string {
        if (password.length < 1) {
            return '密码不能为空';
        } else if (username.length < 1) {
            return '用户名不能为空';
        } else if ((username.indexOf('@') !== -1) &&
            (!username.endsWith('@navinfo.com') && !username.endsWith('@mapbar.com'))) {
            return '用户名必须为 xxx@navinfo.com 或者 xxx@mapbar.com';
        }

        return '';
    }

    syncWithCookie() {
        this.username = this.cookieService.get(LOGIN_NAME);
        this.nickname = this.cookieService.get(LOGIN_DISPLAY_NAME);
        const token = this.cookieService.get(LOGIN_TOKEN);
        this.loginSucceeded = token !== null && token !== '';
    }

    download(url: string) {
        if (this.loginSucceeded) {
            window.open(url);
        } else {
            window.alert('请先登录');
        }
    }
}
