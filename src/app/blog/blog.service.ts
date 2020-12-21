import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as marked from 'marked';

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    constructor(private http: HttpClient) {}

    /**
     * 获得文章内容
     */
    getArticleContent() {
        const url = 'assets/page/typescript.md';
        return this.http
            .get(url, {
                responseType: 'text',
            })
            .pipe(map(result => marked(result)));
    }
}
