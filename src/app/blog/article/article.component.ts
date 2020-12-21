import { BlogService } from './../blog.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);
import 'highlight.js/styles/github.css';
// hljs.configure({ useBR: true });

@Component({
    selector: 'cy-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, AfterViewInit {
    content: string;
    constructor(private service: BlogService) {}

    ngOnInit(): void {
        this.loadArticleContent();
    }

    ngAfterViewInit() {}

    loadArticleContent() {
        this.service.getArticleContent().subscribe(result => {
            this.content = result;
            setTimeout(() => {
                document.querySelectorAll('pre code').forEach(block => {
                    hljs.highlightBlock(block);
                });
            }, 1);
        });
    }
}
