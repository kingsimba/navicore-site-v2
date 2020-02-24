import { Component, OnInit, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
    @ViewChild('docContent', { static: false }) docContent: ElementRef;
    @ViewChild('navigation', { static: false }) navigation: ElementRef;
    @ViewChild('siderBar', { static: false }) siderBar: ElementRef;

    siderBarHeight: number;
    siderBarClass: string;
    currentDocUrl: string;

    constructor(
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public loginService: LoginService
    ) {
        router.events.subscribe((val) => {
            // see also
            if (val instanceof NavigationEnd) {
                this.updatePageIfNeeded();
            }
        });

        this.loginService.loginStatusChanged.subscribe({
            next: value => {
                this.updatePageIfNeeded();
            }
        })
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
            this.siderBarClass = 'nz-sider-sticky';
            this.siderBarHeight = window.innerHeight;
        } else {
            this.siderBarClass = '';
            this.siderBarHeight = window.innerHeight - 64 + window.pageYOffset;
        }
    }

    ngOnInit() {
        this.onWindowScroll();
    }

    updatePageIfNeeded() {
        if (!this.loginService.loginSucceeded)
        {
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
        // trim anchor #xxxx
        let docUrl: string = url;
        const anchorIndex = docUrl.lastIndexOf('#');
        if (anchorIndex !== -1) {
            docUrl = docUrl.substring(0, docUrl.lastIndexOf('#'));
        }
        if (this.currentDocUrl !== docUrl) {
            this.loadPage(docUrl);
        }
    }

    loadPage(docUrl: string) {
        const path = docUrl.substring(0, docUrl.lastIndexOf('/'));
        this.currentDocUrl = docUrl;

        this.http.get(`/api${docUrl}`, { responseType: 'text' }).subscribe({
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
            },
            error: err => {
                this.docContent.nativeElement.innerHTML = 'error: ' + err;
            }
        });
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
            links[i].addEventListener('click', this.openDocument.bind(this));
        }
    }

    getNavigationElement(doc: Document): Element {
        const navigation = doc.querySelector('.wy-menu');
        return navigation;
    }

    openDocument(doc: any) {
        const url = doc.currentTarget.getAttribute('url');
        this.router.navigateByUrl(url);
    }
}
