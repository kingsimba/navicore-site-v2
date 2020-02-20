import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
    @ViewChild('docContent', { static: false }) docContent: ElementRef;

    constructor(
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        router.events.subscribe((val) => {
            // see also 
            if (val instanceof NavigationEnd)
            {
                this.loadPage();
            }
        });
    }

    ngOnInit() {
    }

    loadPage() {
        let url = this.router.url;
        if (!url.endsWith('.html')) {
            url = url + '/index.html';
        }
        const path: string = url.substring(0, url.lastIndexOf('/'));

        this.http.get(`/assets${url}`, { responseType: 'text' }).subscribe({
            next: value => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(value, 'text/html');
                const mainDocument = doc.querySelector('.document');
                const images = mainDocument.querySelectorAll('img');

                // correct all images
                for (let i = images.length; i--;) {
                    const src = images[i].getAttribute('src');
                    images[i].setAttribute('src', `/assets${path}/${src}`);
                }

                // make all link to use router
                const links = mainDocument.querySelectorAll('a');
                for (let i = links.length; i--;) {
                    const href = links[i].getAttribute('href');
                    links[i].removeAttribute('href');
                    links[i].setAttribute('url', `${path}/${href}`);
                    links[i].addEventListener('click', this.openDocument.bind(this));
                }

                this.docContent.nativeElement.innerHTML = '';
                this.docContent.nativeElement.insertAdjacentElement('beforeend', mainDocument);
            },
            error: err => {
                this.docContent.nativeElement.setInnerHtml('beforeend', 'error: ' + err);
            }
        });
    }

    openDocument(doc: any) {
        let url = doc.currentTarget.getAttribute('url');
        this.router.navigateByUrl(url);
    }
}
