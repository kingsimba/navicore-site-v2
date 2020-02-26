import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { DocListService, Document } from '../doc-list.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit, OnDestroy {
    documents: Document[] = [];
    docChangeSub: Subscription;

    constructor(
        private router: Router,
        private http: HttpClient,
        public loginService: LoginService,
        private docListService: DocListService) {

        this.documents = this.docListService.getDocuments();
        this.docListService.refreshDocs();
    }

    ngOnInit() {
        this.docChangeSub = this.docListService.documentsChanged.subscribe(
            {
                next: docs => {
                    this.documents = docs;
                }
            }
        );
    }

    ngOnDestroy() {
        this.docChangeSub.unsubscribe();
    }

    openDocument(doc: string) {
        this.router.navigateByUrl(`docs/${doc}`);
    }
}
