import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { DocListService, Document } from '../doc-list.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {
    documents: Document[] = [];
    subscription: Subscription;

    constructor(
        private router: Router,
        private http: HttpClient,
        public loginService: LoginService,
        private docListService: DocListService) {

        this.documents = this.docListService.getDocuments();
        this.docListService.refreshDocs();
    }

    ngOnInit() {
        this.subscription = this.docListService.documentsChanged.subscribe(
            {
                next: docs => {
                    this.documents = docs;
                }
            }
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openDocument(doc: string) {
        this.router.navigateByUrl(`docs/${doc}`);
    }
}
