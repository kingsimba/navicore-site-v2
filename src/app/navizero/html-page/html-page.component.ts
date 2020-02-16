import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    template: `<div class="appContent" [innerHtml]="myTemplate"></div>`,
    styles: []
})
export class HtmlPageComponent implements OnInit {

    myTemplate: any = '';

    constructor(private http: HttpClient,
                private activatedRoute: ActivatedRoute
        ) {
        let docUrl: string = this.activatedRoute.snapshot.paramMap.get('doc');

        if (docUrl === 'NaviZeroPrivatePolicy.htm') {
            docUrl = 'privacy.html';
        } else if (docUrl === 'NaviZeroServiceTerms.htm') {
            docUrl = 'service-terms.html';
        } else if (!docUrl.endsWith('.html')) {
            docUrl = docUrl + '.html';
        }

        this.http.get(`/assets/navizero/${docUrl}`, { responseType: 'text' }).subscribe(
            data => {
                this.myTemplate = data;
            }
        );
    }

    ngOnInit() {
    }

}
