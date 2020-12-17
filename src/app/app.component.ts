import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cy-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    menu_switch: boolean;

    constructor() {}

    ngOnInit(): void {}
}
