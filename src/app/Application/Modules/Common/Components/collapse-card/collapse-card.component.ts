import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-collapse-card',
    templateUrl: './collapse-card.component.html',
    styleUrls: ['./collapse-card.component.scss']
})
export class CollapseCardComponent implements OnInit {

    @Input() isCollapsed = false;

    /*
    *  [
        {   id:1,
            title: "test title",
            operation: "/test"
        },
    ];
    * */
    @Input() actions: any

    @Input() title: string;
    @Input() containActions = false;
    @Output() onSelectAction = new EventEmitter<any>();
    @Input() showCollapseArrow = true;
    @Input() selectedIndex = 0;

    constructor() {
    }

    ngOnInit(): void {
    }

    selectAction(event) {
        this.onSelectAction.emit(this.rebuildObj(event))
    }

    extractTitles() {
        return this.actions.map((action) => action.title)
    }

    rebuildObj(title: string) {
        return this.actions.filter((action) => action.title == title)[0]
    }

    toggleCollapse() {
        if (this.containActions) {
            this.isCollapsed = !this.isCollapsed;
        }
    }

}
