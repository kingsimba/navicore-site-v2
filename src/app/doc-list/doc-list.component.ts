import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { DocListService } from '../doc-list.service';

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {
    documents: Document[] = [];

    constructor(
        private router: Router,
        private http: HttpClient,
        public loginService: LoginService,
        private docListService: DocListService) {

        docListService.documentsChanged.subscribe(
            {
                next: docs => {
                    this.documents = docs;
                }
            }
        )

        this.docListService.refreshDocs();
    }

    ngOnInit() {
    }

    openDocument(doc: string) {
        this.router.navigateByUrl(`docs/${doc}`);
    }
}
