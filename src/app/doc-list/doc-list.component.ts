import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { DocListService, Document } from '../doc-list.service';
import { Subscription } from 'rxjs';

interface ItemData {
    href: string;
    title: string;
    image: string;
    content: string;
}

interface DocumentList {
    title: string;
    documents: Document[];
}

@Component({
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit, OnDestroy {
    docChangeSub: Subscription;
    featuredDocuments: ItemData[] = [];
    documentListArray: DocumentList[];

    private documents: Document[] = [];

    constructor(
        private router: Router,
        private http: HttpClient,
        public loginService: LoginService,
        private docListService: DocListService) {

        this.documents = this.docListService.getDocuments();
        this.loadData();
        this.docListService.refreshDocs();
    }

    ngOnInit() {
        this.docChangeSub = this.docListService.documentsChanged.subscribe(
            {
                next: docs => {
                    this.documents = docs;
                    this.loadData();
                }
            }
        );
    }

    ngOnDestroy() {
        this.docChangeSub.unsubscribe();
    }

    openDocument(link: string) {
        this.router.navigateByUrl(link);
    }

    indexOfDoument(docs: Document[], link: string) {
        for (let index = 0; index < docs.length; index++) {
            const doc = docs[index];
            if (doc.link === link) {
                return index;
            }
        }
        return -1;
    }

    loadData(): void {
        const items = [
            {
                href: 'docs/navicore-public-docs',
                title: `NaviCore 公开文档`,
                image: 'assets/docs/navicore-public-docs.png',
                content:
                    '本文档由引擎组开发人员编写，介绍了引擎各个模块的功能和实现。'
                    + '文档主要重在展示引擎的功能和技术优势，不包含较为敏感的技术实现细节。'
                    + '本文档的阅读对象为产品、测试、商务人员。可以给客户端开发、商务合作、标书编写提供素材。'
            },
            {
                href: 'docs/competitive-analysis',
                title: `NaviCore 竞品分析和需求差距调研`,
                image: 'assets/docs/competitive-analysis.png',
                content:
                    '通过本文档，我们希望暴露出我们的导航产品和竞品，以及和用户实际需求之间的差距。 希望相关业务单元知耻而后勇，努力改进我们的产品。'
                    + '本文档把功能按照状态分为几类：已完成、正在研发、等待研发、未计划、需要其他团队支持'
            },
            {
                href: 'docs/competitive-analysis-trimmed',
                title: `NaviCore 竞品分析和需求差距调研(删节版)`,
                image: 'assets/docs/competitive-analysis-trimmed.png',
                content:
                    '通过本文档，我们希望暴露出我们的导航产品和竞品，以及和用户实际需求之间的差距。 希望相关业务单元知耻而后勇，努力改进我们的产品。'
                    + '本文档把功能按照状态分为几类：已完成、正在研发、等待研发、未计划、需要其他团队支持'
            },
            {
                href: 'docs/ncdocs',
                title: `NaviCore Developer's Guide`,
                image: 'assets/docs/ncdocs.png',
                content:
                    'The intended readers of this document are the users of NaviCore and the developers'
                    + ' of it. This document intents to help developers to understand NaviCore, to use it'
                    + ' to the advantages and to help making it better.'
            }
        ];

        // build otherDocuments
        this.featuredDocuments = [];
        const otherDocuments = [...this.documents];
        items.forEach(item => {
            const index = this.indexOfDoument(otherDocuments, item.href);
            if (index !== -1) {
                this.featuredDocuments.push(item);
                otherDocuments.splice(index, 1);
            }
        });

        // build serverDocuments
        const serverDocuments = [];
        [
            'route-server',
            'poi-server',
            'map-matching-server',
            'ti-servers'
        ].forEach(name => {
            const index = this.indexOfDoument(otherDocuments, 'docs/' + name);
            if (index !== -1) {
                serverDocuments.push(otherDocuments[index]);
                otherDocuments.splice(index, 1);
            }
        });

        // build moduleDocuments
        const moduleDocuments = [];
        [
            'jnavicore-developer-guide',
            'routing',
            'poi-nc',
            'map-render-nc',
            'junction-view',
            'real3d',
            'camera',
        ].forEach(name => {
            const index = this.indexOfDoument(otherDocuments, 'docs/' + name);
            if (index !== -1) {
                moduleDocuments.push(otherDocuments[index]);
                otherDocuments.splice(index, 1);
            }
        });

        // Finally, create this.documentListArray
        this.documentListArray = [
            { title: '服务器文档', documents: serverDocuments },
            { title: '引擎模块文档', documents: moduleDocuments },
            { title: '其它文档', documents: otherDocuments },
        ]
    }
}
