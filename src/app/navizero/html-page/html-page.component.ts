import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    template: `<div class="appContent" [innerHtml]="myTemplate"></div>`,
    styles: []
})
export class HtmlPageComponent implements OnInit {

    myTemplate: any = '';

    constructor(private http: HttpClient,
                private router: Router,
                private activatedRoute: ActivatedRoute
        ) {
    }

    ngOnInit() {
        const path: string = this.router.url.substring(0, this.router.url.lastIndexOf('/') + 1);
        let docUrl: string = this.activatedRoute.snapshot.paramMap.get('doc');

        if (docUrl === 'NaviZeroPrivatePolicy.htm') {
            docUrl = path + 'privacy.html';
        } else if (docUrl === 'NaviZeroServiceTerms.htm') {
            docUrl = path + 'service-terms.html';
        } else if (!docUrl.endsWith('.html')) {
            docUrl = path + docUrl + '.html';
        } else {
            docUrl = path + docUrl;
        }

        this.http.get(`/assets${docUrl}`, { responseType: 'text' }).subscribe(
            {
                next: value => {
                    this.myTemplate = value;
                },
                error: err => {
                    this.myTemplate = 'error: ' + err;
                }
            }
        );
    }

}
