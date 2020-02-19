import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    template: `<div class="appContent" [innerHtml]="docTemplate"></div>`,
    styles: []
})
export class DocsComponent implements OnInit {

    docTemplate: string;
    documents: string[];

    constructor(private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        const url: string = this.router.url;

        this.http.get(`/assets${url}`, { responseType: 'text' }).subscribe(
            {
                next: value => {
                    this.docTemplate = value;
                },
                error: err => {
                    this.docTemplate = 'error: ' + err;
                }
            }
        );
    }
}
