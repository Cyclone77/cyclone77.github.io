import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';

const routes: Routes = [
    {
        path: '',
        component: BlogComponent,
    },
];

@NgModule({
    declarations: [BlogComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
