import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    template: `
        <div class="appContent" #docContent></div>
    `,
    styles: []
})
export class DocsComponent implements OnInit {
    @ViewChild('docContent', { static: false }) docContent: ElementRef;

    constructor(
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
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
                for (let i = images.length; i--;) {
                    const src = images[i].getAttribute('src');
                    images[i].setAttribute('src', `/assets${path}/${src}`);
                }
                const links = mainDocument.querySelectorAll('a');
                for (let i = links.length; i--;) {
                    const href = links[i].getAttribute('href');
                    links[i].setAttribute('href', `${path}/${href}`);
                }

                this.docContent.nativeElement.insertAdjacentElement('beforeend', mainDocument);
            },
            error: err => {
                this.docContent.nativeElement.setInnerHtml('beforeend', 'error: ' + err);
            }
        });
    }
}
