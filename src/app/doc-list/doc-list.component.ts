import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.css']
})
export class DocListComponent implements OnInit {
    documents: string[];

    constructor(private http: HttpClient, public loginService: LoginService) { }

    ngOnInit() {
        this.refreshDocs();
    }

    refreshDocs() {
        this.http.get('/list').subscribe({
            next: value => {
                this.documents = value['list'];
            }
        });
    }
}
