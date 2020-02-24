import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {
    documents: string[];

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
        if (this.loginService.loginSucceeded) {
            this.http.get('/api/list').subscribe({
                next: value => {
                    this.documents = value['list'];
                }
            });
        }
    }

    openDocument(doc: string) {
        this.router.navigateByUrl(`docs/${doc}`);
    }
}
