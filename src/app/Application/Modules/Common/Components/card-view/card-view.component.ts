import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-card-view',
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent implements OnInit {
    @Input() title: string;
    @Input() hasLinkedAction: boolean = false;
    @Input() hasLinkedActionTitle: string = "Link Title";
    @Input() containsTabs: boolean = false;
    @Input() tabsList: any = [{id: 1, name: 'Tab 1'}, {id: 2, name: 'Tab 2'}, {id: 3, name: 'Tab 3'}]
    @Output() clickEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() tabEmitter: EventEmitter<any> = new EventEmitter<any>();
    activeTab: any;

    constructor() {
    }

    ngOnInit(): void {
        if (this.containsTabs) {
            this.switchTab(this.tabsList[0])
        }
    }

    clickEvent(): void {
        this.clickEmitter.emit();
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.tabEmitter.emit(tab);
    }

    isActiveTab(tab) {
        return this.activeTab === tab;
    }
}
