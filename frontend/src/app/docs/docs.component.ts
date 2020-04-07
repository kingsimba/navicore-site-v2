import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../login.service';
import { Observable, Subscription } from 'rxjs';
import '../../modernizr-custom.js';
import { Title } from '@angular/platform-browser';
import { Lightbox } from 'ngx-lightbox';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit, OnDestroy {
    @ViewChild('docContent', { static: false }) docContent: ElementRef;
    @ViewChild('navigation', { static: false }) navigation: ElementRef;
    @ViewChild('siderBar', { static: false }) siderBar: ElementRef;
    @ViewChild('footer', { static: false }) footer: ElementRef;

    titleBarBottom: number;
    titleBarVisible = true;
    siderBarHeight: number;
    currentDocUrl: string;
    loadingDocUrl: string;
    loadingDocument: boolean;
    isCollapsed = true;
    documentTitle: string;
    documentTitleLink: string;
    linkToPrev = '';
    linkToNext = '';
    titleToNext = '';
    titleToPrev = '';

    private innerWidth: any;
    private oldTitle: string;

    private routerSubs: Subscription;
    private loginSubs: Subscription;
    private docSubs: Subscription;

    constructor(
        private titleService: Title,
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public loginService: LoginService,
        private lightbox: Lightbox
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
        this.oldTitle = this.titleService.getTitle();
        this.innerWidth = window.innerWidth;
        this.adjustScrollBar();
    }

    ngOnDestroy() {
        this.titleService.setTitle(this.oldTitle);
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
        this.innerWidth = window.innerWidth;
        this.adjustScrollBar();
    }

    supportTouch() {
        return Modernizr.touchevents;
    }

    private adjustScrollBar() {
        if (window.pageYOffset > 54) {
            this.titleBarVisible = false;
            this.siderBarHeight = window.innerHeight;
            this.titleBarBottom = window.pageYOffset;
        } else {
            this.titleBarVisible = true;
            this.siderBarHeight = window.innerHeight - 54 + window.pageYOffset;
            this.titleBarBottom = 54;
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
        if (!url.endsWith('.html') && url.indexOf('#') === -1) {
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
                    const doc: HTMLDocument = parser.parseFromString(value, 'text/html');
                    const mainDocument = doc.querySelector('.document');
                    const images = mainDocument.querySelectorAll('img');

                    // correct all images
                    for (let i = images.length; i--;) {
                        const src = images[i].getAttribute('src');

                        images[i].setAttribute('src', `/api${path}/${src}`);
                        images[i].setAttribute('style', `cursor: pointer`);
                        images[i].addEventListener('click', this.openLightbox.bind(this));
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

                    // title
                    const titleEle = doc.querySelector('.icon-home');
                    this.documentTitle = titleEle.innerHTML.trim();
                    this.titleService.setTitle(this.documentTitle + ' - NaviCore'); // html title
                    const docRootPath = this.router.url.split('/').slice(0, 3).join('/');
                    this.documentTitleLink = docRootPath;

                    // footer
                    const footerNode = doc.querySelector('.rst-footer-buttons');
                    this.correctLinks(footerNode, docUrl, path);
                    this.makeFootBar(footerNode);
                },
                error: err => {
                    this.docContent.nativeElement.innerHTML = 'error: ' + err;
                    this.loadingDocument = false;
                    observer.error(err);
                    if (err.status === 401) {
                        setTimeout(() => { this.loginService.performLogout(); }, 0);
                    }
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

    private makeFootBar(footerNode: Element) {
        this.linkToNext = this.linkToPrev = '';

        // find "previous" and "next" button
        const footerButtons = footerNode.querySelectorAll('.btn');
        const footerNext = footerNode.querySelector('.btn.float-right');
        let footerPrev = null;
        if (footerNext === null) {
            footerPrev = footerButtons[0];
        } else if (footerButtons.length === 2) {
            footerPrev = footerNext === footerButtons[0] ? footerButtons[1] : footerButtons[0];
        }

        // get information from the two buttons
        if (footerNext !== null) {
            this.linkToNext = footerNext.getAttribute('url');
            this.titleToNext = footerNext.getAttribute('title');
        }
        if (footerPrev !== null) {
            this.linkToPrev = footerPrev.getAttribute('url');
            this.titleToPrev = footerPrev.getAttribute('title');
        }
    }

    private correctLinks(rootNode: Element, docUrl: string, path: string): void {
        // make all link to use angular router
        const links = rootNode.querySelectorAll('a');
        for (let i = links.length; i--;) {
            const href = links[i].getAttribute('href');
            if (href.startsWith('#')) {
                // section anchors
                links[i].setAttribute('url', `${docUrl}${href}`);

                // use router
                links[i].removeAttribute('href');
                links[i].addEventListener('click', this.onClickLink.bind(this));
            } else if (this.isExternalLink(href)) {
                // absolute links. They are external links
                links[i].setAttribute('target', `_blank`);
            } else {
                // relative links
                links[i].setAttribute('url', `${path}/${href}`);

                // use router
                links[i].removeAttribute('href');
                links[i].addEventListener('click', this.onClickLink.bind(this));
            }
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

        if (!this.urlIsDocument(docUrl)) {
            window.open(`/api${docUrl}`, '_blank');
            return;
        }

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

    public toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    isDesktop() {
        return this.innerWidth >= 768;
    }

    onWheel(): boolean {
        return false;   // block scroll event
    }

    openLightbox(image: any) {
        const url = image.currentTarget.getAttribute('src');
        const album = [];
        album.push({
            src: url
        });
        this.lightbox.open(album);
    }

    private isExternalLink(url: string) {
        return (url.startsWith('http://') || url.startsWith('https://'))
            && !url.includes(location.hostname)
            && !url.startsWith('#');
    }

    private urlIsDocument(url: string): boolean {
        if (url.endsWith('.html') || url.endsWith('.htm')) {
            return true;
        }

        return false;
    }
}
