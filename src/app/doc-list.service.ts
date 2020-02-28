import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';

export class Document {
    constructor(public name: string, public link: string) { }

    static documentsEqual(l: Document[], r: Document[]): boolean {
        if (l.length !== r.length) {
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

    isEqual(r: Document): boolean {
        return this.name === r.name && this.link === r.link;
    }
}

@Injectable({
    providedIn: 'root'
})
export class DocListService implements OnDestroy {

    private documents: Document[] = [];
    private loginSubs: Subscription;
    private loadDocSubs: Subscription;

    private docNameList = {
        "camera": "独立电子眼模块设计文档",
        "competitive analysis": "NaviCore 竞品分析和需求差距调研",
        "competitive analysis trimed": "NaviCore 竞品分析和需求差距调研(删节版)",
        "jnavicore developer guide": "JNaviCore Developer's Guide",
        "navicore public docs": "NaviCore 公开文档",
        "ncdocs": "NaviCore Developer’s Guide",
        "poi nc": "POI搜索模块设计说明",
        "poi server": "Poi Server 设计文档说明",
        "real3d": "NaviCore Real3D Design Specification",
        "routing": "Route Engine Documentation",
        "ti servers": "Ti数据服务",
        "write doc with restructuredtext": "使用Sublime、ResT和RTD进行文档编写",
        "writing techinical documents": "技术文档编写经验谈"
    };

    documentsChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private http: HttpClient, private loginService: LoginService) {
        this.loginSubs = this.loginService.loginStatusChanged.subscribe({
            next: value => {
                this.refreshDocs();
            }
        });
    }

    ngOnDestroy() {
        this.loginSubs.unsubscribe();
        this.loadDocSubs.unsubscribe();
    }

    getDocuments(): Document[] {
        return this.documents;
    }

    setDocuments(docs: Document[]) {
        if (!Document.documentsEqual(this.documents, docs)) {
            this.documents = docs;
            this.documentsChanged.emit(docs);
        }
    }

    refreshDocs() {
        if (this.documents.length === 0 && this.loginService.loginSucceeded) {
            if (this.loadDocSubs != null) {
                this.loadDocSubs.unsubscribe();
            }
            this.loadDocSubs = this.http.get('/api/list').subscribe({
                next: value => {
                    const docs = value['list'];
                    const modifiedDocs: Document[] = [];
                    for (const doc of docs) {
                        let name: string = doc.split('-').join(' ');
                        const changedName = this.docNameList[name.toLowerCase()];
                        if (changedName) {
                            name = changedName;
                        }
                        const docObj = new Document(name, doc);
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
