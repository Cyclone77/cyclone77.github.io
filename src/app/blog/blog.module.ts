import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BlogComponent } from './blog.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
    {
        path: '',
        component: BlogComponent,
    },
    {
        path: 'article',
        component: ArticleComponent,
    },
];

@NgModule({
    declarations: [BlogComponent, ArticleComponent],
    imports: [HttpClientModule, CommonModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
