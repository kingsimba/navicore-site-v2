import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../login.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit, OnDestroy {
    @ViewChild('docContent', { static: false }) docContent: ElementRef;
    @ViewChild('navigation', { static: false }) navigation: ElementRef;
    @ViewChild('siderBar', { static: false }) siderBar: ElementRef;

    titleBarBottom: number;
    titleBarVisible = true;
    siderBarHeight: number;
    currentDocUrl: string;
    loadingDocUrl: string;
    loadingDocument: boolean;
    isCollapsed = false;

    private routerSubs: Subscription;
    private loginSubs: Subscription;
    private docSubs: Subscription;

    constructor(
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public loginService: LoginService
    ) {
        this.routerSubs = this.router.events.subscribe((val) => {
            // see also
            if (val instanceof NavigationEnd) {
                this.updatePageIfNeeded();
            }
        });

        this.loginSubs = this.loginService.loginStatusChanged.subscribe({
            next: value => {
                this.updatePageIfNeeded();
            }
        });
    }

    ngOnInit() {
        this.onWindowScroll();
    }

    ngOnDestroy() {
         this.routerSubs.unsubscribe();
         this.loginSubs.unsubscribe();
         this.docSubs.unsubscribe();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.adjustScrollBar();
    }

    @HostListener('window:resize', [])
    onWindowResize() {
        this.adjustScrollBar();
    }

    private adjustScrollBar() {
        if (window.pageYOffset > 64) {
            this.titleBarVisible = false;
            this.siderBarHeight = window.innerHeight;
            this.titleBarBottom = window.pageYOffset;
        } else {
            this.titleBarVisible = true;
            this.siderBarHeight = window.innerHeight - 64 + window.pageYOffset;
            this.titleBarBottom = 64;
        }
    }

    updatePageIfNeeded() {
        if (!this.loginService.loginSucceeded) {
            this.currentDocUrl = '';
            return;
        }

        let url = this.router.url;
        if (url === '/docs') {
            return;
        }
        if (!url.endsWith('.html')) {
            url = url + '/index.html';
        }
        this.openLink(url);
    }

    loadPage<T>(docUrl: string): Observable<T> {
        const observable = new Observable<T>((observer) => {
            const path = docUrl.substring(0, docUrl.lastIndexOf('/'));
            this.currentDocUrl = docUrl;
            this.loadingDocument = true;

            const subscription = this.http.get(`/api${docUrl}`, { responseType: 'text' }).subscribe({
                next: value => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(value, 'text/html');
                    const mainDocument = doc.querySelector('.document');
                    const images = mainDocument.querySelectorAll('img');

                    // correct all images
                    for (let i = images.length; i--;) {
                        const src = images[i].getAttribute('src');

                        images[i].setAttribute('src', `/api${path}/${src}`);
                    }

                    this.correctLinks(mainDocument, docUrl, path);

                    this.docContent.nativeElement.innerHTML = '';
                    this.docContent.nativeElement.insertAdjacentElement('beforeend', mainDocument);

                    const navigationEle = this.getNavigationElement(doc);
                    this.correctLinks(navigationEle, docUrl, path);
                    this.navigation.nativeElement.innerHTML = '';
                    this.navigation.nativeElement.insertAdjacentElement('beforeend', navigationEle);
                    this.loadingDocument = false;
                    observer.next(null);
                },
                error: err => {
                    this.docContent.nativeElement.innerHTML = 'error: ' + err;
                    this.loadingDocument = false;
                    observer.error(err);
                }
            });

            return {
                unsubscribe() {
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            };
        });

        return observable;
    }

    private correctLinks(rootNode: Element, docUrl: string, path: string): void {
        // make all link to use angular router
        const links = rootNode.querySelectorAll('a');
        for (let i = links.length; i--;) {
            const href = links[i].getAttribute('href');
            if (href.startsWith('#')) {
                // section anchors
                links[i].setAttribute('url', `${docUrl}${href}`);
            } else {
                // relative links
                links[i].setAttribute('url', `${path}/${href}`);
            }

            // use router
            links[i].removeAttribute('href');
            links[i].addEventListener('click', this.onClickLink.bind(this));
        }
    }

    getNavigationElement(doc: Document): Element {
        const navigation = doc.querySelector('.wy-menu');
        return navigation;
    }

    onClickLink(doc: any) {
        const url = doc.currentTarget.getAttribute('url');
        this.openLink(url, true);
    }

    openLink(url: string, navigateTo: boolean = false): void {
        const docUrl = this.getDocUrlFromFullUrl(url);
        if (this.currentDocUrl !== docUrl) {
            if (this.docSubs) {
                this.docSubs.unsubscribe();
            }
            this.docSubs = this.loadPage(docUrl).subscribe({
                next: value => {
                    this.router.navigateByUrl(url);
                }
            });
        } else if (navigateTo) {
            this.router.navigateByUrl(url);
        }
    }

    private getDocUrlFromFullUrl(fullUrl: string): string {
        // trim #anchor from url
        let docUrl: string = fullUrl;
        const anchorIndex = docUrl.lastIndexOf('#');
        if (anchorIndex !== -1) {
            docUrl = docUrl.substring(0, docUrl.lastIndexOf('#'));
        }
        return docUrl;
    }
}
