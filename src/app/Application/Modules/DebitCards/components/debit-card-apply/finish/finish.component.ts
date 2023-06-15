import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'arb-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit {

    @Input() success: boolean = true;

    constructor() {
    }

    ngOnInit(): void {
    }

}
