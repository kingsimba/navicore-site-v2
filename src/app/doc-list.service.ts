import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { LoginService } from './login.service';

class Document {
    constructor(public name: string, public link: string) { }

    isEqual(r: Document): boolean {
        return this.name === r.name && this.link === r.link;
    }

    static documentsEqual(l: Document[], r: Document[]): boolean {
        if (l.length != r.length) {
            return false;
        }

        for (let index = 0; index < l.length; index++) {
            const elementL = l[index];
            const elementR = r[index];
            if (!elementL.isEqual(elementR)) {
                return false;
            }
        }

        return true;
    }
}

@Injectable({
    providedIn: 'root'
})
export class DocListService {

    private documents: Document[] = [];
    documentsChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private http: HttpClient,
        private loginService: LoginService) {
        this.loginService.loginStatusChanged.subscribe({
            next: value => {
                this.refreshDocs();
            }
        });
    }

    getDocuments() {
        return this.documents;
    }

    setDocuments(docs: Document[]) {
        if (!Document.documentsEqual(this.documents, docs)) {
            this.documents = docs;
            this.documentsChanged.emit(docs);
        }
    }

    refreshDocs() {
        if (this.documents.length == 0 && this.loginService.loginSucceeded) {
            this.http.get('/api/list').subscribe({
                next: value => {
                    const docs = value['list'];
                    let modifiedDocs: Document[] = [];
                    for (const doc of docs) {
                        const docObj = new Document(doc.split('-').join(' '), doc);
                        modifiedDocs.push(docObj);
                    }
                    this.setDocuments(modifiedDocs);
                }
            });
        }

        if (!this.loginService.loginSucceeded) {
            this.setDocuments([]);
        }
    }
}
