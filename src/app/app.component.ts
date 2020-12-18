import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'cy-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    menu_switch: boolean;
    meunList = environment.menus;

    constructor() {}

    ngOnInit(): void {}
}
