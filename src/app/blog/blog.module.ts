import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BlogComponent } from './blog.component';

const routes: Routes = [
    {
        path: '',
        component: BlogComponent,
    },
];

@NgModule({
    declarations: [BlogComponent],
    imports: [HttpClientModule, CommonModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
