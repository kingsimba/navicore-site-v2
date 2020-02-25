import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

class Docment {
    constructor(public name: string, public link: string) { }
}

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {
    documents: Docment[] = [];

    constructor(
        private router: Router,
        private http: HttpClient,
        public loginService: LoginService) {

        this.loginService.loginStatusChanged.subscribe({
            next: value => {
                this.refreshDocs();
            }
        });
    }

    ngOnInit() {
        this.refreshDocs();
    }

    refreshDocs() {
        if (this.documents.length == 0 && this.loginService.loginSucceeded) {
            this.http.get('/api/list').subscribe({
                next: value => {
                    const docs = value['list'];
                    let modifiedDocs: Docment[] = [];
                    for (const doc of docs) {
                        const docObj = new Docment(doc.split('-').join(' '), doc);
                        modifiedDocs.push(docObj);
                    }
                    this.documents = modifiedDocs;
                }
            });
        }

        if (!this.loginService.loginSucceeded)
        {
            this.documents = [];
        }
    }

    openDocument(doc: string) {
        this.router.navigateByUrl(`docs/${doc}`);
    }
}
